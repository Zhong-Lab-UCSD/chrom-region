/**
 * A JS class representing chromosomal regions with several basic operations.
 *
 * @license
 * Copyright 2017-2019 The Regents of the University of California.
 * All Rights Reserved.
 *
 * Created by Xiaoyi Cao
 * Department of Bioengineering
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @module ChromRegion
 */

const log4js = require('@log4js-node/log4js-api')
const logger = log4js.getLogger('givengine')

/**
 * Basic chromosome information.
 * @typedef {Object} ChromInfo
 * @property {ChromRegion} chrRegion - The range of the chromosome
 * @property {ChromRegion} [cent] - The range of the chromosome centromere
 */

/**
 * An object that can be used to initialize `ChromRegion`
 * @typedef {Object} ChromRegionLikeObj
 * @property {string} chr - The name of the chromosome
 * @property {number} start - The start of the chromosomal region
 * @property {number} end - The end of the chromosomal region
 * @property {boolean|null|string} [strand] - The strand of the region, `null`
 *    for unknown or not applicable, `string`s like `'-'` are also acceptable.
 */

/**
 * An dictionary-like object with chromosomal name as keys and `ChromInfo` type
 * as values.
 * @typedef {Object.<string, ChromInfo>} ChromInfoCollection
 */

/**
 * A coordinate object with chromosome name and single coordinate value.
 * @typedef {Object} CoordinateObj
 * @property {string} chr - The chromosome name
 * @property {number} coor - The coordinate value
 */

/**
 * Data structure for chromosomal region.
 * @class
 * @alias module:ChromRegion
 * @property {string} chr - Chromosome name
 * @property {number} start - Starting coordinate
 * @property {number} end - Ending coordinate (not included in the region)
 * @property {boolean|null} strand - The strand of the region, `null` for
 *    unknown or not applicable
 * @property {Object|null} data - any general data that needs to be attached
 *    to this chromosomal region
 */
class ChromRegion {
  /**
   * @constructor
   * @param {string|ChromRegion|ChromRegionLikeObj} mainParams
   *    Main parameters used in the `ChromRegion`.
   *
   *    Either use a `string` like `chr1:12345-56789` or an `object` with `chr`,
   *    `start`, `end` (required), and `strand` (optional) or other essential
   *    properties.
   *
   *    A `ChromRegion` instance can also be used, in which case the behavior
   *    will be similar to a copy constructor.
   * @param {ChromInfoCollection} [chromInfo] - The collection of chromosomal
   *    information for the reference genome of the region, used for clipping
   *    the region, use falsey values to omit.
   * @param {Object} [additionalParams] - Additional parameters to be added to
   *    `this`.
   * @param {boolean} [zeroBased] - Whether the given chrom region's coordinate
   *    is zero based. __Note:__ Internal storage of the chrom region is always
   *    zero-based.
   */
  constructor (mainParams, chromInfo, additionalParams, zeroBased) {
    try {
      if (typeof mainParams === 'string') {
        this._regionFromString(
          mainParams, chromInfo, additionalParams, zeroBased)
      } else if (typeof mainParams === 'object') {
        this._regionFromObject(mainParams, additionalParams)
      } else {
        throw new Error(
          'Must create ChromRegion with object or string!')
      }
      if (isNaN(this._start) || isNaN(this._end)) {
        throw new Error(
          'ChromRegion start and/or end number invalid!')
      }
      this.clipRegion(chromInfo)
    } catch (e) {
      logger.warn(e)
      logger.warn('When creating chromosomal regions with: ')
      logger.warn(mainParams)
      throw (e)
    }
  }

  /**
   * Merge the properties of a parameter object into `this`. If `this` already
   * has a property with the same name (or cannot be assigned for any reason),
   * it will be ignored.
   *
   * @param {Object} paramObject - The parameter object
   * @returns {ChromRegion} Returns `this`
   * @protected
   */
  _mergeParameters (paramObject) {
    if (typeof paramObject === 'object') {
      for (let key in paramObject) {
        if (!this.hasOwnProperty(key) && paramObject.hasOwnProperty(key)) {
          try {
            this[key] = paramObject[key]
          } catch (e) {
            logger.info(e)
          }
        }
      }
    }
    return this
  }

  /**
   * Clip the chromosomal region.
   *
   * All coordinates less than `this.constructor.CHROM_BASE` will be clipped to
   * `this.constructor.CHROM_BASE`.
   *
   * If the chromosomal information collection (from a reference) is provided,
   * the chromosomal region will be clipped according to the matching
   * chromosomal information in the collection. For example, in reference
   * GRCh38, chromosome 1 has a range of [1, 248956422], then a ChromRegion
   * `chr1:100-300000000` will be clipped to `chr1:100-248956422` after calling
   * this function.
   *
   * The function can also provide a minimum chromosomal length, if the clipped
   * region's `length` is less than the minimal length, it will be extended
   * accordingly to try to match the minimum chromosomal length.
   *
   * @param {ChromInfoCollection} [chromInfo] - The collection of chromosomal
   *    information.
   * @param {number} [minLength] - the minimum chromosomal length
   * @returns {ChromRegion} `this`
   */
  clipRegion (chromInfo, minLength) {
    if (this._start < this.constructor.CHROM_BASE) {
      this._start = this.constructor.CHROM_BASE
    }
    if (chromInfo) {
      if (chromInfo[this.chr.toLowerCase()]) {
        this.chr = chromInfo[this.chr.toLowerCase()].chrRegion.chr
        if (chromInfo[this.chr].chrRegion._end < this._end) {
          this._end = chromInfo[this.chr].chrRegion._end
        }
      } else if (!chromInfo[this.chr]) {
        // this is not a valid chromosome
        throw (new Error(
          this.chr + ' is not a valid chromosome within the given chromInfo!'))
      }
    }
    if (typeof minLength === 'number' && minLength >= 0) {
      if (this._start > this._end - minLength) {
        logger.info('Coordinates out of bounds: ' + this.chr +
          ':' + this._start + '-' + this._end + '.')
        this._start = Math.max(
          this.constructor.CHROM_BASE, this._end - minLength)
        if (chromInfo) {
          this._end = Math.min(
            chromInfo[this.chr].chrRegion._end, this._start + minLength)
        }
        logger.info('Changed into: ' + this.chr + ':' +
          this._start + '-' + this._end + '.')
      }
    } else if (this._start > this._end) {
      throw (new Error(
        'Coordinates out of bounds: ' + this.chr + ':' +
        this._start + '-' + this._end + '!'))
    }
    return this
  }

  /**
   * Length of the chromosomal region
   * @type {number}
   *
   * @readonly
   */
  get length () {
    return this._end - this._start
  }

  /**
   * An object with the chromosomal name and starting coordinate.
   * @type {CoordinateObj}
   *
   * @readonly
   */
  get startCoor () {
    return { chr: this.chr, coor: this._start }
  }

  /**
   * An object with the chromosomal name and ending coordinate __(included)__.
   * @type {CoordinateObj}
   *
   * @readonly
   */
  get endCoor () {
    return { chr: this.chr, coor: this._end - 1 }
  }

  /**
   * Starting coordinate. Setting to invalid values will cause an exception to
   * be thrown. Note that this value should be the first 0-based coordinate
   * __within__ the region (__inclusive__). It will be one smaller than the
   * starting value in the `'chrX:XXXXX-XXXXX'` annotation as the annotation is
   * 1-based inclusive.
   * @type {number}
   */
  get start () {
    return this._start
  }

  /**
   * Ending coordinate. Setting to invalid values will cause an exception to
   * be thrown. Note that this value should be the first 0-based coordinate
   * __after__ the region (__exclusive__). This will be the same end value in
   * the `'chrX:XXXXX-XXXXX'` annotation as the annotation is 1-based inclusive.
   * If `this.end === this.start`, the `length` of the region is 0.
   * @type {number}
   */
  get end () {
    return this._end
  }

  set start (newStart) {
    if (isNaN(newStart) || newStart > this._end) {
      throw (new Error('Invalid new start value: ' + newStart))
    }
    this._start = newStart
  }

  set end (newEnd) {
    if (isNaN(newEnd) || newEnd < this._start) {
      throw (new Error('Invalid new end value: ' + newEnd))
    }
    this._end = newEnd
  }

  /**
   * Convert the region string `chrX:XXXX-XXXX` to `this`
   *
   * @param {string} regionString - The string to be converted from
   * @param {ChromInfoCollection} [chromInfo] - The collection of chromosomal
   *    information (used to clip `this`).
   * @param {Object} [additionalParams] - Additional parameters to be added to
   *    `this`.
   * @param {boolean} [zeroBased] - Whether the string is zero-based
   * @returns {ChromRegion} `this`
   * @protected
   */
  _regionFromString (regionString, chromInfo, additionalParams, zeroBased) {
    if (chromInfo &&
      chromInfo[regionString.toLowerCase()]
    ) {
      this.chr = chromInfo[regionString.toLowerCase()].chrRegion.chr
      this._start =
        chromInfo[regionString.toLowerCase()].chrRegion._start
      this._end = chromInfo[regionString.toLowerCase()].chrRegion._end
      this.strand = null
    } else {
      var cleanedChrString = regionString.replace(/,/g, '')
        .replace(/\(\s*-\s*\)/g, ' NEGSTR')
        .replace(/\(\s*\+\s*\)/g, ' POSSTR')
      var elements = cleanedChrString.split(/\s*(?::|-|\s)\s*/)

      this.chr = elements[0]
      this._start = parseInt(elements[1]) -
        (zeroBased ? 0 : (1 - this.constructor.CHROM_BASE))
      this._end = parseInt(elements[2])
      this.strand = (elements.length < 4
        ? this._strand : !(elements[3] === 'NEGSTR'))
    }
    this._mergeParameters(additionalParams)
    return this
  }

  /**
   * Convert an `object` with `chr`, `start`, `end` and (optional) `strand`
   * properties to `this`
   *
   * @param {Object} regionObject - The object to be converted from
   * @param {string} regionObject.chr - The chromosome name
   * @param {number} regionObject.start - The starting coordinate
   * @param {number} regionObject.end - The ending coordinate
   * @param {boolean} [regionObject.strand] - The strand information
   * @param {string} [regionObject.regionname] - The name of the region, will
   *    take precedence over `regionObject.name`
   * @param {string} [regionObject.name] - The name of the region
   * @param {Object} [additionalParams] - Additional parameters to be added to
   *    `this`.
   * @returns {ChromRegion} `this`
   * @protected
   */
  _regionFromObject (regionObject, additionalParams) {
    if (regionObject && typeof regionObject.bedString === 'string') {
      this._regionFromBed(regionObject.bedString)
      delete regionObject.bedString
    } else {
      this.chr = regionObject.chr
      this._start = parseInt(regionObject.start)
      this._end = parseInt(regionObject.end)
      this.strand = regionObject.strand
      this.name = regionObject.regionname || regionObject.name || ''
    }
    this._mergeParameters(regionObject)
    this._mergeParameters(additionalParams)
    return this
  }

  /**
   * Convert the BED format string `chrX XXXX XXXX` to `this`. Note that only
   * the 1st-3rd fields (BED3), the 4th field (if exists), and the 6th field
   * (if exists) are used.
   *
   * @param {string} bedString - The BED string to be converted from
   * @returns {ChromRegion} `this`
   * @protected
   */
  _regionFromBed (bedString) {
    // notice that this only handle chr, start, end, name, strand in BED 4+
    //    format
    var tokens = bedString.split(/ +|\t/)
    this.chr = tokens[0]
    this._start = parseInt(tokens[1])
    this._end = parseInt(tokens[2])
    this.strand = (tokens.length < 6) ? this._strand : tokens[5]
    this.name = (tokens[3] && tokens[3] !== '.')
      ? tokens[3] : (this.name || '')
    return this
  }

  /**
   * Convert `this` to a human-readable string
   * `<chromosome name>:<start>-<end>(<strand>)`
   *
   * @param {boolean} [includeStrand=true] - Whether to include strand
   *    information at the end. If `this` does not have strand information, this
   *    flag has no effect.
   *
   *    __Note:__ Default value is `true`.
   * @returns {string}
   */
  regionToString (includeStrand) {
    // default is including strand
    return this.chr + ':' +
      (this._start + 1 - this.constructor.CHROM_BASE) + '-' + this._end +
      ((includeStrand === false || this._strand === null)
        ? '' : (' (' + (this._strand ? '+' : '-') + ')'))
  }

  /**
   * Convert `this` to a BED4/BED6 string
   *
   * @param {boolean} [includeStrand=true] - Whether to include strand
   *    information at the end. If `true` (default), a BED6 string will be
   *    returned with strand field being `+`, `-` or `.` and score field being
   *    `0`.
   *
   *    __Note:__ Default value is `true`.
   * @returns {string}
   */
  regionToBed (includeStrand) {
    return this.chr + '\t' + this._start + '\t' + this._end + '\t' +
      (this.name ? this.name : '.') +
      ((includeStrand !== false && this._strand !== null)
        ? '\t0\t' + (!this._strand ? '-' : '+') : '')
  }

  /**
   * Convert `this` to a human-readable string with strand information.
   *
   * @returns {string}
   */
  toString () {
    // default is including strand
    return this.regionToString(true)
  }

  /**
   * Strand information, `null` for unknown or not applicable.
   * @type {boolean|null}
   */
  set strand (newStr) {
    switch (typeof (newStr)) {
      case 'string':
        if (newStr === '.' || newStr === '') {
          this._strand = null
        } else {
          this._strand = !(newStr.indexOf('-') >= 0 ||
            newStr.indexOf('0') >= 0)
        }
        break
      case 'number':
        this._strand = (newStr > 0)
        break
      case 'boolean':
        this._strand = newStr
        break
      case 'undefined':
        this._strand = null
        break
      default:
        this._strand = (newStr === null ? null : !!(newStr))
    }
    return this._strand
  }

  get strand () {
    return this._strand
  }

  /**
   * Strand information in string, padded with flanking strings.
   *
   * @param {string} flankbefore - Flanking string before the result,
   *    for example: `'('`
   * @param {string} flankafter - Flanking string after the result,
   *    for example: `')'`
   * @returns {string}
   */
  getStrand (flankbefore, flankafter) {
    return (typeof this._strand === 'boolean')
      ? (((typeof flankbefore === 'string') ? flankbefore : '') +
        (this._strand ? '+' : '-') +
        ((typeof flankafter === 'string') ? flankafter : ''))
      : null
  }

  /**
   * The possibly shortened name of `this`.
   *
   * The name shortening rule:
   * *  If `length` of `this.name` is not greater than
   *    `this.constructor._REGION_SHORTNAME_LIMIT`, no shortening happens;
   * *  If `length` of `this.name` is greater than
   *    `this.constructor._REGION_SHORTNAME_LIMIT`, it will be shortened by
   *    taking only the front substring with a length of
   *    `this.constructor._REGION_SHORTNAME_PREFIX_LENGTH`, adding ellipsis
   *    ('`...`'), then taking the ending substring with a length of
   *    `this.constructor._REGION_SHORTNAME_SUFFIX_LENGTH`
   *
   * For example, suppose all values are at their default, then:
   * *  `'Region1'` will become `'Region1'`;
   * *  `'Superlongregion123'` will become `'Superl...n123'`
   * @type {string}
   * @readonly
   */
  get shortName () {
    return this.constructor._shortenString(this.name,
      this.constructor._REGION_SHORTNAME_LIMIT,
      this.constructor._REGION_SHORTNAME_PREFIX_LENGTH,
      this.constructor._REGION_SHORTNAME_SUFFIX_LENGTH)
  }

  /**
   * Return the length of overlaps between `this` and any given region.
   *
   * @param {ChromRegion} region - The region to be overlapped with.
   * @param {boolean} [strandSpecific] - Whether this overlap should be strand-
   *    specific. If `true`, regions with different strands will not be
   *    considered as overlapping.
   *
   *    __NOTE:__ Regions without strands will not be affected. Consider
   *    `strand === null` as a wildcard that matches any strand.
   * @returns {number}
   */
  overlaps (region, strandSpecific) {
    if (this.chr !== region.chr ||
      (strandSpecific &&
        (this._strand !== null && region._strand !== null) &&
        this._strand !== region._strand)) {
      return 0
    }
    if (this._start >= region._end || this._end <= region._start) {
      return 0
    }
    return Math.round(Math.min(this._end, region._end)) -
      Math.round(Math.max(this._start, region._start))
  }

  /**
   * Assimilate `region` if `this` overlaps with it by expanding `this` to
   * cover the entire `region`.
   *
   * If `this` does not overlap with `region`, return `null` (`this` will not be
   * changed in this case).
   *
   * @param {ChromRegion} region - The region to be assimilated.
   * @param {boolean} [strandSpecific] - Whether the assimilation is
   *    strand-specific.
   * @param {boolean} [ignoreOverlap] - If `true`, the region to be assimilated
   *    does not need to be overlapping with `this` (it still needs to be at
   *    the same chromosome, though).
   * @returns {ChromRegion|null}
   */
  assimilate (region, strandSpecific, ignoreOverlap) {
    if ((!ignoreOverlap && !this.overlaps(region, strandSpecific)) ||
      this.chr !== region.chr || (strandSpecific &&
        (this._strand !== null && region._strand !== null) &&
        this._strand !== region._strand)
    ) {
      return null
    }
    this._start = Math.round(Math.min(this._start, region._start))
    this._end = Math.round(Math.max(this._end, region._end))
    return this
  }

  /**
   * Concatenate `this` with `region`. Concat happens only when the two regions
   * are adjacent to, but not overlapping with each other. `region` can be at
   * the either end of `this`.
   *
   * Return `this` if concatenation happens, `null` otherwise (where `this` will
   * not be changed).
   *
   * @param {ChromRegion} region - The region to be concatenated
   * @param {boolean} [strandSpecific] - Whether the concatenation is
   *    strand-specific
   * @returns {ChromRegion|null}
   */
  concat (region, strandSpecific) {
    if (strandSpecific &&
      (this._strand !== null && region._strand !== null) &&
      this._strand !== region._strand) {
      return null
    }
    if (this._end === region._start) {
      this._end = region._end
    } else if (this._start === region._end) {
      this._start = region._start
    } else {
      return null
    }
    return this
  }

  /**
   * Intersect `this` with `region` by removing non-overlapping parts.
   *
   * If `this` does not overlap with `region`, return `null` (`this` will not be
   * changed in this case).
   *
   * @param {ChromRegion} region - The region to be overlapped
   * @param {boolean} [strandSpecific] - Whether the intersection is
   *    strand-specific
   * @returns {ChromRegion|null}
   */
  intersect (region, strandSpecific) {
    if (!this.overlaps(region, strandSpecific)) {
      return null
    }
    this._start = Math.round(Math.max(this._start, region._start))
    this._end = Math.round(Math.min(this._end, region._end))
    return this
  }

  /**
   * Move `this` by `distance` given. Use a negative value to move to the
   * left-hand side and a positive value to move to the right-hand side.
   *
   * @param {number} distance - The distance to be moved
   * @param {boolean} [isProportion] - Whether `distance` is given as an
   *    absolute bp value or a proportion (of `this.length`).
   * @param {ChromInfoCollection} [chromInfo] - The collection of chromosomal
   *    information for clipping purposes.
   * @param {boolean} [relativeToStrand] - Whether the direction of `distance`
   *    is relative to `this.strand`. Will only be honored if `this.strand`
   *    is not `null`.
   * @returns {ChromRegion}
   */
  move (distance, isProportion, chromInfo, relativeToStrand) {
    // isProportion means whether move by proportion
    // may clip distance to what we have
    if (isProportion) {
      distance *= this.length
    }
    distance = Math.round(distance)
    if (!Number.isInteger(distance)) {
      throw new Error('Distance should be a valid number!')
    }
    if (relativeToStrand && this.strand === false) {
      distance = -distance
    }
    if (distance + this._start < this.constructor.CHROM_BASE) {
      distance = this.constructor.CHROM_BASE - this._start
    } else if (chromInfo && chromInfo[this.chr] &&
      chromInfo[this.chr].chrRegion._end < this._end + distance) {
      distance = chromInfo[this.chr].chrRegion._end - this._end
    }
    this._start = this._start + distance
    this._end = this._end + distance
    return this
  }

  /**
   * Returns a clone of `this`, all additional properties will be
   * shallow-copied.
   *
   * @returns {ChromRegion}
   */
  clone () {
    return new this.constructor(this)
  }

  /**
   * Get a copy of `this` with shifted location (`this` will not change).
   * See `this.move` for parameter details.
   *
   * @param {number} distance - The shift distance.
   * @param {boolean} [isProportion] - Whether `distance` is given as an
   *    absolute bp value or a proportion (of `this.length`).
   * @param {ChromInfoCollection} [chromInfo] - The collection of chromosomal
   *    information for clipping purposes.
   * @param {boolean} [relativeToStrand] - Whether the direction of `distance`
   *    is relative to `this.strand`. Will only be honored if `this.strand`
   *    is not `null`.
   * @returns {ChromRegion}
   */
  getShift (distance, isProportion, chromInfo, relativeToStrand) {
    return this.clone()
      .move(distance, isProportion, chromInfo, relativeToStrand)
  }

  /**
   * Extend / Shrink `this`
   *
   * @param {number} sizeDiff - The difference to be extended / shrunk. Use
   *    a positive value to extend and a negative value to shrink.
   * @param {number} [center] - The center point for the extension / shrinkage.
   *
   *    Difference in sizes (additional bases after extension / removed bases
   *    after shrinkage) will be allocated proportionally to the length of
   *    `this` separated by `center`.
   *
   *    Default value is the center of `this`, so that additional bases will be
   *    equally distributed to both ends and removed bases will be equally taken
   *    from both ends.
   *
   *    If `center` is at `this.start`, then all extended bases will be put at
   *    the end and all removed bases will be taken from the end.
   *
   *    If `center` is outside `this`, it will be moved to the closest point
   *    on `this`.
   * @param {boolean} [isProportion] -  Whether `sizeDiff` is an absolute bp
   *    value or a proportion of `this.length`.
   * @param {ChromInfoCollection} [chromInfo] - The collection of chromosomal
   *    information for clipping purposes.
   * @param {number} [minimumSize] - The minimum size of the resulting
   *    `ChromRegion` object.
   * @returns {ChromRegion}
   */
  extend (sizeDiff, center, isProportion, chromInfo, minimumSize) {
    // isProportion means whether extend by proportion
    minimumSize = (typeof minimumSize === 'number' &&
      !Number.isNaN(minimumSize) && minimumSize >= 0)
      ? minimumSize : 1
    if (!sizeDiff) {
      return this
    }
    if (isProportion) {
      sizeDiff *= this.length
    }
    sizeDiff = Math.round(sizeDiff)
    if (!Number.isInteger(sizeDiff)) {
      throw new Error('Size difference should be a valid number!')
    }
    var newsize = this.length + sizeDiff
    center = (typeof center === 'number' && !Number.isNaN(center))
      ? center : (this._start + this._end) / 2
    if (center < this._start) {
      center = this._start
    } else if (center > this._end) {
      center = this._end
    }
    if (newsize < minimumSize) {
      newsize = minimumSize
      sizeDiff = newsize - this.length
    } else if (chromInfo && chromInfo[this.chr] &&
      chromInfo[this.chr].chrRegion.length < newsize) {
      newsize = chromInfo[this.chr].chrRegion.length
    }
    if (center > this._start) {
      // extend left
      this._start = this._start -
        Math.round(sizeDiff * (center - this._start) / this.length)
      if (this._start < this.constructor.CHROM_BASE) {
        this._start = this.constructor.CHROM_BASE
      }
      this._end = this._start + newsize
    } else {
      this._end = this._end + sizeDiff
    }
    if (chromInfo && chromInfo[this.chr] &&
      chromInfo[this.chr].chrRegion._end < this._end) {
      this._end = chromInfo[this.chr].chrRegion._end
      this._start = this._end - newsize
    }
    return this
  }

  /**
   * Get an extended / shrunk copy of `this`. `this` will not be changed.
   * See `this.extend` for parameter details.
   *
   * @param {number} sizeDiff - The difference to be extended / shrunk. Use
   *    a positive value to extend and a negative value to shrink.
   * @param {number} [center] - The center point for the extension / shrinkage.
   * @param {boolean} [isProportion] -  Whether `sizeDiff` is an absolute bp
   *    value or a proportion of `this.length`.
   * @param {ChromInfoCollection} [chromInfo] - The collection of chromosomal
   *    information for clipping purposes.
   * @param {number} [minimumSize] - The minimum size of the resulting
   *    `ChromRegion` object.
   * @returns {ChromRegion}
   */
  getExtension (sizeDiff, center, isProportion, chromInfo, minimumSize) {
    return this.clone().extend(
      sizeDiff, center, isProportion, chromInfo, minimumSize)
  }

  /**
   * Helper function to clip a coordinate object (see `this.startCoor` or
   * `this.endCoor`) with a collection of `chromInfo`.
   *
   * @static
   * @param {CoordinateObj} coor - Coordinate object
   * @param {ChromInfoCollection} [chromInfo] - The collection of chromosomal
   *    information.
   * @returns {CoordinateObj}
   */
  static clipCoordinate (coor, chromInfo) {
    // this is to clip single coordinate
    if (coor.coor < this.CHROM_BASE) {
      coor.coor = this.CHROM_BASE
    }
    if (chromInfo && chromInfo[coor.chr] &&
      chromInfo[coor.chr].chrRegion._end - 1 < coor.coor
    ) {
      coor.coor = chromInfo[coor.chr].chrRegion._end - 1
    }
    if (chromInfo && chromInfo[coor.chr] &&
      chromInfo[coor.chr].chrRegion._start > coor.coor
    ) {
      coor.coor = chromInfo[coor.chr].chrRegion._start
    }
    return coor
  }

  /**
   * Validate whether the region is a valid region.
   *
   * @static
   * @param {ChromRegion|string} chrRegion - The region to be validated
   * @param {ChromInfoCollection} [chromInfo] - The reference object
   * @returns {boolean}
   */
  static isValidChromRegion (chrRegion, chromInfo) {
    try {
      var tempChrRegion = new this(chrRegion)
      tempChrRegion.clipRegion(chromInfo)
    } catch (e) {
      logger.info(e)
      return false
    }
    return true
  }

  /**
   * Split chromosome name into three parts:
   * 1.  `Chr` (if exists)
   * 2.  Chromosome number (if exists), will be converted to `number`
   * 3.  The rest of the name
   *
   * @param {string} name Chromosome name to be splited
   * @returns {Array<string|number>}
   */
  static _splitChromNamePart (name) {
    let arr = name.toLowerCase().match(/^((?:chr)?)(\d*)(.*)/)
    arr.shift()
    arr[1] = arr[1] ? parseInt(arr[1]) : ''
    return arr
  }

  /**
   * Compare chromosome names in a more natural way, so that
   * `chr10` should be larger than `chr2` (not the lexicographical order)
   * @param {string} name1 Name of the first chromosome name
   * @param {string} name2 Name of the second chromosome name
   */
  static _compareChromNames (name1, name2) {
    // note: `chr2` should be smaller than `chr10`
    let nameArr1 = this._splitChromNamePart(name1)
    let nameArr2 = this._splitChromNamePart(name2)
    let result = 0
    nameArr1.some((entry, index) => {
      if (entry !== nameArr2[index]) {
        result = (entry === ''
          ? 1 : (nameArr2[index] === ''
            ? -1 : (entry < nameArr2[index] ? -1 : 1)))
        return true
      }
      return false
    })
    return result
  }

  /**
   * Compare two `ChromRegion`s
   *
   * Whether `region1` is considered "smaller than" (to the left-hand side of),
   * equal to, or "larger than" (to the right-hand side of) `region2` is
   * determined by the following criteria:
   * *  If `region1.chr` has a lower 'natural' order
   *    (see `this._compareChromNames`) than `region2.chr`, it is considered
   *    smaller, otherwise:
   * *  If `region1.chr === region2.chr`, but `region1.start` is smaller than
   *    `region2.start`, it is considered smaller, otherwise:
   * *  If `region1.chr === region2.chr` and `region1.start === region2.start`,
   *    but `region1.end` is smaller than `region2.end`, it is considered
   *    smaller, otherwise:
   * *  If `chr`, `start` and `end` of `region1` and `region2` are equal,
   *    `region1` is considered equal to `region2`, otherwise `region1` is
   *    considered larger than `region2`.
   *
   * @static
   * @param {ChromRegion} region1
   * @param {ChromRegion} region2
   * @returns {number} `0` if `region1` equals to `region2`, `-1` if
   *    `region1` is smaller than `region2`, `1` if `region1` is larger than
   *    `region2`
   */
  static compare (region1, region2) {
    return (this || ChromRegion)._compareChromNames(region1.chr, region2.chr) ||
      ((region1.start === region2.start)
        ? ((region1.end === region2.end)
          ? 0 : ((region1.end > region2.end) ? 1 : -1))
        : ((region1.start > region2.start) ? 1 : -1))
  }

  /**
   * Determine whether two regions are equal (`chr`, `start`, `end` are equal)
   *
   * @static
   * @param {ChromRegion} region1
   * @param {ChromRegion} region2
   * @returns {boolean}
   */
  static isEqual (region1, region2) {
    return (region1 && region2)
      ? (region1.chr === region2.chr &&
        region1.start === region2.start && region1.end === region2.end)
      : (!!region1 === !!region2)
  }

  /**
   * Helper function to get a shortened string if it exceeds a given limit.
   *
   * @static
   * @param {string} str - String to be shortened
   * @param {number} limit - Limit of string length
   * @param {number} prefixLength - Prefix length if shortening happens
   * @param {number} suffixLength - Suffix length if shortening happens
   * @returns {string}
   * @protected
   */
  static _shortenString (str, limit, prefixLength, suffixLength) {
    prefixLength = prefixLength || 0
    suffixLength = suffixLength || 0
    if (str && str.length > limit) {
      return str.substr(0, prefixLength) + '...' +
        str.substr(str.length - suffixLength)
    } else {
      return str
    }
  }
}

ChromRegion._REGION_SHORTNAME_LIMIT = 11
ChromRegion._REGION_SHORTNAME_PREFIX_LENGTH = 6
ChromRegion._REGION_SHORTNAME_SUFFIX_LENGTH = 4
ChromRegion.CHROM_BASE = 0 // may be 0 for UCSC

module.exports = ChromRegion
