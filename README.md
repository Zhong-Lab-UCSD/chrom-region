# chrom-region <!-- omit in toc --> 
Chromosomal region class used in GIVE, supporting some basic region operations.

- [Install](#install)
- [Usage](#usage)
- [Testing](#testing)
- [Class API Documentation](#class-api-documentation)
    - [ChromRegion](#chromregion)

# Install
```bash
npm install @givengine/chrom-region
```

# Usage
```javascript
// Import class definition
const ChromRegion = require('@givengine/chrom-region')

// Instantiate a ChromRegion object
var newRegion = new ChromRegion('chr1:12345-67890')

// Operate on ChromRegions
newRegion.extend(1, true)
console.log(newRegion.toString())
```

# Testing

To be completed in future updates

# Class API Documentation

## Classes <!-- omit in toc --> 

<dl>
<dt><a href="#ChromRegion">ChromRegion</a></dt>
<dd><p>ChromRegion
Data structure for chromosomal region</p>
</dd>
</dl>

<a name="ChromRegion"></a>

## ChromRegion
Data structure for chromosomal region

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| chr | <code>String</code> | Chromosome name |
| start | <code>Number</code> | Starting coordinate |
| end | <code>Number</code> | Ending coordinate (not included in the region) |
| strand | <code>Boolean</code> \| <code>null</code> | The strand of the region, `null` for    unknown or not applicable |
| data | <code>Object</code> \| <code>null</code> | any general data that needs to be attached    to this chromosomal region |


<a name="new_ChromRegion_new"></a>

### new ChromRegion(mainParams, [refObj], [additionalParams], [zeroBased])
Creates an instance of ChromRegion.


| Param | Type | Description |
| --- | --- | --- |
| mainParams | [<code>ChromRegion</code>](#ChromRegion) \| <code>string</code> | Main parameters used in the `ChromRegion`.    Either use a `string` like `chr1:12345-56789` or an `object` with `chr`,    `start`, `end` (required), and `strand` (optional) or other essential    properties.    A `ChromRegion` instance can also be used, in which case the behavior    will be similar to a copy constructor. |
| [refObj] | <code>RefObject</code> | Reference genome of the region,    used for clipping the region, use falsey values to omit |
| [additionalParams] | <code>object</code> | Additional parameters to be added to    `this`. |
| [zeroBased] | <code>boolean</code> | Whether the given chrom region's coordinate    is zero based. __Note:__ Internal storage of the chrom region is always    zero-based. |

<a name="ChromRegion+length"></a>

### chromRegion.length : <code>Number</code>
Length of the chromosomal region

**Kind**: instance property of [<code>ChromRegion</code>](#ChromRegion)  
**Read only**: true  
<a name="ChromRegion+startCoor"></a>

### chromRegion.startCoor : <code>Object</code>
An object with the chromosomal name and starting coordinate.
Will be in the form of
`{chr: <chromosomal name>, coor: <start coordinate>}`

**Kind**: instance property of [<code>ChromRegion</code>](#ChromRegion)  
**Read only**: true  
<a name="ChromRegion+endCoor"></a>

### chromRegion.endCoor : <code>Object</code>
An object with the chromosomal name and ending coordinate.
Will be in the form of
`{chr: <chromosomal name>, coor: <end coordinate>}`

**Kind**: instance property of [<code>ChromRegion</code>](#ChromRegion)  
**Read only**: true  
<a name="ChromRegion+start"></a>

### chromRegion.start : <code>Number</code>
Starting coordinate. Setting to invalid values will cause an exception to
be thrown

**Kind**: instance property of [<code>ChromRegion</code>](#ChromRegion)  
<a name="ChromRegion+end"></a>

### chromRegion.end : <code>Number</code>
Ending coordinate. Setting to invalid values will cause an exception to
be thrown

**Kind**: instance property of [<code>ChromRegion</code>](#ChromRegion)  
<a name="ChromRegion+strand"></a>

### chromRegion.strand : <code>Boolean</code> \| <code>null</code>
Strand information, `null` for unknown or not applicable.

**Kind**: instance property of [<code>ChromRegion</code>](#ChromRegion)  
<a name="ChromRegion+shortName"></a>

### chromRegion.shortName
Get the possibly shortened name of `this`.

The name shortening rule:
*  If `length` of `this.name` is not greater than
   `this.constructor._REGION_SHORTNAME_LIMIT`, no shortening happens;
*  If `length` of `this.name` is greater than
   `this.constructor._REGION_SHORTNAME_LIMIT`, it will be shortened by
   taking only the front substring with a length of
   `this.constructor._REGION_SHORTNAME_PREFIX_LENGTH`, adding ellipsis
   ('`...`'), then taking the ending substring with a length of
   `this.constructor._REGION_SHORTNAME_SUFFIX_LENGTH`

For example, suppose all values are at their default, then:
*  `'Region1'` will become `'Region1'`;
*  `'Superlongregion123'` will become `'Superl...n123'`

**Kind**: instance property of [<code>ChromRegion</code>](#ChromRegion)  
**Read only**: true  
<a name="ChromRegion+clipRegion"></a>

### chromRegion.clipRegion([refObj], [minLength]) ⇒ [<code>ChromRegion</code>](#ChromRegion)
Clip the chromosomal region.

All negative coordinates will be clipped to 0.

If reference object is provided, the chromosomal region will be clipped
according to the reference. For example, in reference GRCh38, chromosome 1
has a range of [1, 248956422], then a ChromRegion `chr1:100-300000000` will
be clipped to `chr1:100-248956422` after calling this function. Negative
values will also be clipped.

The function can also provide a minimum chromosomal length, if the clipped
region's `length` is less than the minimal length, it will be extended
accordingly to try to match the minimum chromosomal length.

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  
**Returns**: [<code>ChromRegion</code>](#ChromRegion) - `this`  

| Param | Type | Description |
| --- | --- | --- |
| [refObj] | <code>RefObject</code> | the reference object |
| [minLength] | <code>Number</code> | the minimum chromosomal length |

<a name="ChromRegion+_regionFromString"></a>

### chromRegion.\_regionFromString(regionString, zeroBased, refObj) ⇒ [<code>ChromRegion</code>](#ChromRegion)
Convert the region string `chrX:XXXX-XXXX` to `this`

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  
**Returns**: [<code>ChromRegion</code>](#ChromRegion) - `this`  

| Param | Type | Description |
| --- | --- | --- |
| regionString | <code>String</code> | The string to be converted from |
| zeroBased | <code>Boolean</code> | Whether the string is zero-based |
| refObj | <code>RefObject</code> | The reference object (used to clip `this`) |

<a name="ChromRegion+_regionFromObject"></a>

### chromRegion.\_regionFromObject(regionObject) ⇒ [<code>ChromRegion</code>](#ChromRegion)
Convert an `object` with `chr`, `start`, `end` and (optional) `strand`
properties to `this`

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  
**Returns**: [<code>ChromRegion</code>](#ChromRegion) - `this`  

| Param | Type | Description |
| --- | --- | --- |
| regionObject | <code>Object</code> | The object to be converted from |
| regionObject.chr | <code>String</code> | The chromosome name |
| regionObject.start | <code>Number</code> | The starting coordinate |
| regionObject.end | <code>Number</code> | The starting coordinate |
| [regionObject.strand] | <code>Boolean</code> | The starting coordinate |
| [regionObject.regionname] | <code>String</code> | The name of the region, will    take precedence over `regionObject.name` |
| [regionObject.name] | <code>String</code> | The name of the region |

<a name="ChromRegion+_regionFromBed"></a>

### chromRegion.\_regionFromBed(bedString) ⇒ [<code>ChromRegion</code>](#ChromRegion)
Convert the BED format string `chrX XXXX XXXX` to `this`. Note that only
the 1st-3rd fields (BED3), the 4th field (if exists), and the 6th field
(if exists) are used.

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  
**Returns**: [<code>ChromRegion</code>](#ChromRegion) - `this`  

| Param | Type | Description |
| --- | --- | --- |
| bedString | <code>String</code> | The BED string to be converted from |

<a name="ChromRegion+regionToString"></a>

### chromRegion.regionToString(includeStrand) ⇒ <code>String</code>
Convert `this` to a human-readable string
`<chromosome name>:<start>-<end>(<strand>)`

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| includeStrand | <code>Boolean</code> | Whether to include strand information at    the end. If `this` does not have strand information, this flag has no    effect.    __Note:__ Default value is `true`. |

<a name="ChromRegion+regionToBed"></a>

### chromRegion.regionToBed(includeStrand) ⇒ <code>String</code>
Convert `this` to a BED4/BED6 string

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| includeStrand | <code>Boolean</code> | Whether to include strand information at    the end. If `true` (default), a BED6 string will be returned with strand    field being `+`, `-` or `.` and score field being `0`.    __Note:__ Default value is `true`. |

<a name="ChromRegion+toString"></a>

### chromRegion.toString() ⇒ <code>String</code>
Convert `this` to a human-readable string with strand information.

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  
<a name="ChromRegion+getStrand"></a>

### chromRegion.getStrand(flankbefore, flankafter) ⇒ <code>String</code>
Strand information in string, padded with flanking strings.

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| flankbefore | <code>String</code> | Flanking string before the result,    for example: `'('` |
| flankafter | <code>String</code> | Flanking string after the result,    for example: `')'` |

<a name="ChromRegion+overlaps"></a>

### chromRegion.overlaps(region, [strandSpecific]) ⇒ <code>Number</code>
Return the length of overlaps between `this` and any given region.

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| region | [<code>ChromRegion</code>](#ChromRegion) | The region to be overlapped with. |
| [strandSpecific] | <code>Boolean</code> | Whether this overlap should be strand-    specific. If `true`, regions with different strands will not be    considered as overlapping.    __NOTE:__ Regions without strands will not be affected. Consider    `strand === null` as a wildcard that matches any strand. |

<a name="ChromRegion+assimilate"></a>

### chromRegion.assimilate(region, [strandSpecific]) ⇒ [<code>ChromRegion</code>](#ChromRegion) \| <code>null</code>
Assimilate `region` if `this` overlaps with it by expanding `this` to
cover the entire `region`.

If `this` does not overlap with `region`, return `null` (`this` will not be
changed in this case).

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| region | [<code>ChromRegion</code>](#ChromRegion) | The region to be assimilated. |
| [strandSpecific] | <code>Boolean</code> | Whether the assimilation is    strand-specific. |

<a name="ChromRegion+concat"></a>

### chromRegion.concat(region, [strandSpecific]) ⇒ [<code>ChromRegion</code>](#ChromRegion) \| <code>null</code>
Concatenate `this` with `region`. Concat happens only when the two regions
are adjacent to, but not overlapping with each other. `region` can be at
the either end of `this`.

Return `this` if concatenation happens, `null` otherwise (where `this` will
not be changed).

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| region | [<code>ChromRegion</code>](#ChromRegion) | The region to be concatenated |
| [strandSpecific] | <code>Boolean</code> | Whether the concatenation is    strand-specific |

<a name="ChromRegion+intersect"></a>

### chromRegion.intersect(region, [strandSpecific]) ⇒ [<code>ChromRegion</code>](#ChromRegion) \| <code>null</code>
Intersect `this` with `region` by removing non-overlapping parts.

If `this` does not overlap with `region`, return `null` (`this` will not be
changed in this case).

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| region | [<code>ChromRegion</code>](#ChromRegion) | The region to be overlapped |
| [strandSpecific] | <code>Boolean</code> | Whether the intersection is    strand-specific |

<a name="ChromRegion+move"></a>

### chromRegion.move(distance, [isProportion], [refObj]) ⇒ [<code>ChromRegion</code>](#ChromRegion)
Move `this` by `distance` given. Use a negative value to move to the
left-hand side and a positive value to move to the right-hand side.

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>Number</code> | The distance to be moved |
| [isProportion] | <code>Boolean</code> | Whether `distance` is given as an    absolute bp value or a proportion (of `this.length`). |
| [refObj] | <code>RefObject</code> | Reference object for clipping purposes. |

<a name="ChromRegion+clone"></a>

### chromRegion.clone() ⇒ [<code>ChromRegion</code>](#ChromRegion)
Returns a clone of `this`, all additional properties will be
shallow-copied.

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  
<a name="ChromRegion+getShift"></a>

### chromRegion.getShift(distance, [isProportion], [refObj]) ⇒ [<code>ChromRegion</code>](#ChromRegion)
Get a copy of `this` with shifted location (`this` will not change).
See `this.move` for parameter details.

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>Number</code> | The shift distance. |
| [isProportion] | <code>Boolean</code> | Whether `distance` is given as an    absolute bp value or a proportion (of `this.length`). |
| [refObj] | <code>RefObject</code> | Reference object for clipping purposes. |

<a name="ChromRegion+extend"></a>

### chromRegion.extend(sizeDiff, [center], [isProportion], [refObj], [minimumSize]) ⇒ [<code>ChromRegion</code>](#ChromRegion)
Extend / Shrink `this`

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| sizeDiff | <code>Number</code> | The difference to be extended / shrunk. Use    a positive value to extend and a negative value to shrink. |
| [center] | <code>Number</code> | The center point for the extension / shrinkage.    Difference in sizes (additional bases after extension / removed bases    after shrinkage) will be allocated proportionally to the length of    `this` separated by `center`.    Default value is the center of `this`, so that additional bases will be    equally distributed to both ends and removed bases will be equally taken    from both ends.    If `center` is at `this.start`, then all extended bases will be put at    the end and all removed bases will be taken from the end.    If `center` is outside `this`, it will be moved to the closest point    on `this`. |
| [isProportion] | <code>Boolean</code> | Whether `sizeDiff` is an absolute bp    value or a proportion of `this.length`. |
| [refObj] | <code>RefObject</code> | Reference object for clipping purposes. |
| [minimumSize] | <code>Number</code> | The minimum size of the resulting    `ChromRegion` object. |

<a name="ChromRegion+getExtension"></a>

### chromRegion.getExtension(sizeDiff, [center], [isProportion], [refObj], [minimumSize]) ⇒ [<code>ChromRegion</code>](#ChromRegion)
Get an extended / Shrunk copy of `this`. `this` will not be changed.
See `this.extend` for parameter details.

**Kind**: instance method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| sizeDiff | <code>Number</code> | The difference to be extended / shrunk. Use    a positive value to extend and a negative value to shrink. |
| [center] | <code>Number</code> | The center point for the extension / shrinkage. |
| [isProportion] | <code>Boolean</code> | Whether `sizeDiff` is an absolute bp    value or a proportion of `this.length`. |
| [refObj] | <code>RefObject</code> | Reference object for clipping purposes. |
| [minimumSize] | <code>Number</code> | The minimum size of the resulting    `ChromRegion` object. |

<a name="ChromRegion.clipCoordinate"></a>

### ChromRegion.clipCoordinate(coor, refObj) ⇒ <code>Object</code>
Helper function to clip a coordinate object (see `this.startCoor` or
`this.endCoor`) with a `RefObject`.

**Kind**: static method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| coor | <code>Object</code> | Coordinate object |
| coor.chr | <code>String</code> | The chromosome name of the coordinate object |
| coor.coor | <code>Number</code> | The coordinate of the coordinate object |
| refObj | <code>RefObject</code> | The reference object. |

<a name="ChromRegion.isValidChromRegion"></a>

### ChromRegion.isValidChromRegion(chrRegion, refObj) ⇒ <code>Boolean</code>
Validate whether the region is a valid region.

**Kind**: static method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| chrRegion | [<code>ChromRegion</code>](#ChromRegion) \| <code>String</code> | The region to be validated |
| refObj | <code>RefObject</code> | The reference object |

<a name="ChromRegion.compare"></a>

### ChromRegion.compare(region1, region2) ⇒ <code>Number</code>
Compare two `ChromRegion`s

Whether `region1` is considered "smaller than" (to the left-hand side of),
equal to, or "larger than" (to the right-hand side of) `region2` is
determined by the following criteria:
*  If `region1.chr` has a lower lexicographical order than
   `region2.chr`, it is considered smaller, otherwise;
*  If `region1.chr === region2.chr`, but `region1.start` is smaller than
   `region2.start`, it is considered smaller, otherwise;
*  If `region1.chr === region2.chr` and `region1.start === region2.start`,
   but `region1.end` is smaller than `region2.end`, it is considered
   smaller, otherwise;
*  If `chr`, `start` and `end` of `region1` and `region2` are equal,
   `region1` is considered equal to `region2`, otherwise `region1` is
   considered larger than `region2`.

**Kind**: static method of [<code>ChromRegion</code>](#ChromRegion)  
**Returns**: <code>Number</code> - `0` if `region1` equals to `region2`, `-1` if
   `region1` is smaller than `region2`, `1` if `region1` is larger than
   `region2`  

| Param | Type |
| --- | --- |
| region1 | [<code>ChromRegion</code>](#ChromRegion) | 
| region2 | [<code>ChromRegion</code>](#ChromRegion) | 

<a name="ChromRegion.isEqual"></a>

### ChromRegion.isEqual(region1, region2) ⇒ <code>Boolean</code>
Determine whether two regions are equal (`chr`, `start`, `end` are equal)

**Kind**: static method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type |
| --- | --- |
| region1 | [<code>ChromRegion</code>](#ChromRegion) | 
| region2 | [<code>ChromRegion</code>](#ChromRegion) | 

<a name="ChromRegion._shortenString"></a>

### ChromRegion.\_shortenString(str, limit, prefixLength, suffixLength) ⇒ <code>String</code>
Helper function to get a shortened string if it exceeds a given limit.

**Kind**: static method of [<code>ChromRegion</code>](#ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | String to be shortened |
| limit | <code>Number</code> | Limit of string length |
| prefixLength | <code>Number</code> | Prefix length if shortening happens |
| suffixLength | <code>Number</code> | Suffix length if shortening happens |
