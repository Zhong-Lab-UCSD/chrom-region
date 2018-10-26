<a name="module_ChromRegion"></a>

## ChromRegion
A JS class representing chromosomal regions with several basic operations.

**License**: Copyright 2017-2018 Xiaoyi Cao

* [ChromRegion](#module_ChromRegion)
    * [ChromRegion](#exp_module_ChromRegion--ChromRegion) ⏏
        * [new ChromRegion(mainParams, [chromInfo], [additionalParams], [zeroBased])](#new_module_ChromRegion--ChromRegion_new)
        * _instance_
            * [.length](#module_ChromRegion--ChromRegion+length) : <code>number</code>
            * [.startCoor](#module_ChromRegion--ChromRegion+startCoor) : <code>CoordinateObj</code>
            * [.endCoor](#module_ChromRegion--ChromRegion+endCoor) : <code>CoordinateObj</code>
            * [.start](#module_ChromRegion--ChromRegion+start) : <code>number</code>
            * [.end](#module_ChromRegion--ChromRegion+end) : <code>number</code>
            * [.strand](#module_ChromRegion--ChromRegion+strand) : <code>boolean</code> \| <code>null</code>
            * [.shortName](#module_ChromRegion--ChromRegion+shortName) : <code>string</code>
            * [.clipRegion([chromInfo], [minLength])](#module_ChromRegion--ChromRegion+clipRegion) ⇒ <code>ChromRegion</code>
            * [._regionFromString(regionString, [zeroBased], [chromInfo])](#module_ChromRegion--ChromRegion+_regionFromString) ⇒ <code>ChromRegion</code>
            * [._regionFromObject(regionObject)](#module_ChromRegion--ChromRegion+_regionFromObject) ⇒ <code>ChromRegion</code>
            * [._regionFromBed(bedString)](#module_ChromRegion--ChromRegion+_regionFromBed) ⇒ <code>ChromRegion</code>
            * [.regionToString([includeStrand])](#module_ChromRegion--ChromRegion+regionToString) ⇒ <code>string</code>
            * [.regionToBed([includeStrand])](#module_ChromRegion--ChromRegion+regionToBed) ⇒ <code>string</code>
            * [.toString()](#module_ChromRegion--ChromRegion+toString) ⇒ <code>string</code>
            * [.getStrand(flankbefore, flankafter)](#module_ChromRegion--ChromRegion+getStrand) ⇒ <code>string</code>
            * [.overlaps(region, [strandSpecific])](#module_ChromRegion--ChromRegion+overlaps) ⇒ <code>number</code>
            * [.assimilate(region, [strandSpecific])](#module_ChromRegion--ChromRegion+assimilate) ⇒ <code>ChromRegion</code> \| <code>null</code>
            * [.concat(region, [strandSpecific])](#module_ChromRegion--ChromRegion+concat) ⇒ <code>ChromRegion</code> \| <code>null</code>
            * [.intersect(region, [strandSpecific])](#module_ChromRegion--ChromRegion+intersect) ⇒ <code>ChromRegion</code> \| <code>null</code>
            * [.move(distance, [isProportion], [chromInfo])](#module_ChromRegion--ChromRegion+move) ⇒ <code>ChromRegion</code>
            * [.clone()](#module_ChromRegion--ChromRegion+clone) ⇒ <code>ChromRegion</code>
            * [.getShift(distance, [isProportion], [chromInfo])](#module_ChromRegion--ChromRegion+getShift) ⇒ <code>ChromRegion</code>
            * [.extend(sizeDiff, [center], [isProportion], [chromInfo], [minimumSize])](#module_ChromRegion--ChromRegion+extend) ⇒ <code>ChromRegion</code>
            * [.getExtension(sizeDiff, [center], [isProportion], [chromInfo], [minimumSize])](#module_ChromRegion--ChromRegion+getExtension) ⇒ <code>ChromRegion</code>
        * _static_
            * [.clipCoordinate(coor, [chromInfo])](#module_ChromRegion--ChromRegion.clipCoordinate) ⇒ <code>CoordinateObj</code>
            * [.isValidChromRegion(chrRegion, [chromInfo])](#module_ChromRegion--ChromRegion.isValidChromRegion) ⇒ <code>boolean</code>
            * [.compare(region1, region2)](#module_ChromRegion--ChromRegion.compare) ⇒ <code>number</code>
            * [.isEqual(region1, region2)](#module_ChromRegion--ChromRegion.isEqual) ⇒ <code>boolean</code>
            * [._shortenString(str, limit, prefixLength, suffixLength)](#module_ChromRegion--ChromRegion._shortenString) ⇒ <code>string</code>
        * _inner_
            * [~ChromInfo](#module_ChromRegion--ChromRegion..ChromInfo) : <code>Object</code>
            * [~ChromInfoCollection](#module_ChromRegion--ChromRegion..ChromInfoCollection) : <code>Object.&lt;string, ChromInfo&gt;</code>
            * [~CoordinateObj](#module_ChromRegion--ChromRegion..CoordinateObj) : <code>Object</code>

<a name="exp_module_ChromRegion--ChromRegion"></a>

### ChromRegion ⏏
Data structure for chromosomal region.

**Kind**: Exported class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| chr | <code>string</code> | Chromosome name |
| start | <code>number</code> | Starting coordinate |
| end | <code>number</code> | Ending coordinate (not included in the region) |
| strand | <code>boolean</code> \| <code>null</code> | The strand of the region, `null` for    unknown or not applicable |
| data | <code>Object</code> \| <code>null</code> | any general data that needs to be attached    to this chromosomal region |

<a name="new_module_ChromRegion--ChromRegion_new"></a>

#### new ChromRegion(mainParams, [chromInfo], [additionalParams], [zeroBased])

| Param | Type | Description |
| --- | --- | --- |
| mainParams | <code>ChromRegion</code> \| <code>string</code> | Main parameters used in the `ChromRegion`.    Either use a `string` like `chr1:12345-56789` or an `object` with `chr`,    `start`, `end` (required), and `strand` (optional) or other essential    properties.    A `ChromRegion` instance can also be used, in which case the behavior    will be similar to a copy constructor. |
| [chromInfo] | <code>ChromInfoCollection</code> | The collection of chromosomal    information for the reference genome of the region, used for clipping    the region, use falsey values to omit. |
| [additionalParams] | <code>Object</code> | Additional parameters to be added to    `this`. |
| [zeroBased] | <code>boolean</code> | Whether the given chrom region's coordinate    is zero based. __Note:__ Internal storage of the chrom region is always    zero-based. |

<a name="module_ChromRegion--ChromRegion+length"></a>

#### chromRegion.length : <code>number</code>
Length of the chromosomal region

**Kind**: instance property of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Read only**: true  
<a name="module_ChromRegion--ChromRegion+startCoor"></a>

#### chromRegion.startCoor : <code>CoordinateObj</code>
An object with the chromosomal name and starting coordinate.

**Kind**: instance property of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Read only**: true  
<a name="module_ChromRegion--ChromRegion+endCoor"></a>

#### chromRegion.endCoor : <code>CoordinateObj</code>
An object with the chromosomal name and ending coordinate.

**Kind**: instance property of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Read only**: true  
<a name="module_ChromRegion--ChromRegion+start"></a>

#### chromRegion.start : <code>number</code>
Starting coordinate. Setting to invalid values will cause an exception to

**Kind**: instance property of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
<a name="module_ChromRegion--ChromRegion+end"></a>

#### chromRegion.end : <code>number</code>
Ending coordinate. Setting to invalid values will cause an exception to

**Kind**: instance property of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
<a name="module_ChromRegion--ChromRegion+strand"></a>

#### chromRegion.strand : <code>boolean</code> \| <code>null</code>
Strand information, `null` for unknown or not applicable.

**Kind**: instance property of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
<a name="module_ChromRegion--ChromRegion+shortName"></a>

#### chromRegion.shortName : <code>string</code>
The possibly shortened name of `this`.

**Kind**: instance property of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Read only**: true  
<a name="module_ChromRegion--ChromRegion+clipRegion"></a>

#### chromRegion.clipRegion([chromInfo], [minLength]) ⇒ <code>ChromRegion</code>
Clip the chromosomal region.

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Returns**: <code>ChromRegion</code> - `this`  

| Param | Type | Description |
| --- | --- | --- |
| [chromInfo] | <code>ChromInfoCollection</code> | The collection of chromosomal    information. |
| [minLength] | <code>number</code> | the minimum chromosomal length |

<a name="module_ChromRegion--ChromRegion+_regionFromString"></a>

#### chromRegion.\_regionFromString(regionString, [zeroBased], [chromInfo]) ⇒ <code>ChromRegion</code>
Convert the region string `chrX:XXXX-XXXX` to `this`

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Returns**: <code>ChromRegion</code> - `this`  

| Param | Type | Description |
| --- | --- | --- |
| regionString | <code>string</code> | The string to be converted from |
| [zeroBased] | <code>boolean</code> | Whether the string is zero-based |
| [chromInfo] | <code>ChromInfoCollection</code> | The collection of chromosomal    information (used to clip `this`). |

<a name="module_ChromRegion--ChromRegion+_regionFromObject"></a>

#### chromRegion.\_regionFromObject(regionObject) ⇒ <code>ChromRegion</code>
Convert an `object` with `chr`, `start`, `end` and (optional) `strand`

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Returns**: <code>ChromRegion</code> - `this`  

| Param | Type | Description |
| --- | --- | --- |
| regionObject | <code>Object</code> | The object to be converted from |
| regionObject.chr | <code>string</code> | The chromosome name |
| regionObject.start | <code>number</code> | The starting coordinate |
| regionObject.end | <code>number</code> | The starting coordinate |
| [regionObject.strand] | <code>boolean</code> | The starting coordinate |
| [regionObject.regionname] | <code>string</code> | The name of the region, will    take precedence over `regionObject.name` |
| [regionObject.name] | <code>string</code> | The name of the region |

<a name="module_ChromRegion--ChromRegion+_regionFromBed"></a>

#### chromRegion.\_regionFromBed(bedString) ⇒ <code>ChromRegion</code>
Convert the BED format string `chrX XXXX XXXX` to `this`. Note that only

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Returns**: <code>ChromRegion</code> - `this`  

| Param | Type | Description |
| --- | --- | --- |
| bedString | <code>string</code> | The BED string to be converted from |

<a name="module_ChromRegion--ChromRegion+regionToString"></a>

#### chromRegion.regionToString([includeStrand]) ⇒ <code>string</code>
Convert `this` to a human-readable string

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [includeStrand] | <code>boolean</code> | <code>true</code> | Whether to include strand    information at the end. If `this` does not have strand information, this    flag has no effect.    __Note:__ Default value is `true`. |

<a name="module_ChromRegion--ChromRegion+regionToBed"></a>

#### chromRegion.regionToBed([includeStrand]) ⇒ <code>string</code>
Convert `this` to a BED4/BED6 string

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [includeStrand] | <code>boolean</code> | <code>true</code> | Whether to include strand    information at the end. If `true` (default), a BED6 string will be    returned with strand field being `+`, `-` or `.` and score field being    `0`.    __Note:__ Default value is `true`. |

<a name="module_ChromRegion--ChromRegion+toString"></a>

#### chromRegion.toString() ⇒ <code>string</code>
Convert `this` to a human-readable string with strand information.

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
<a name="module_ChromRegion--ChromRegion+getStrand"></a>

#### chromRegion.getStrand(flankbefore, flankafter) ⇒ <code>string</code>
Strand information in string, padded with flanking strings.

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| flankbefore | <code>string</code> | Flanking string before the result,    for example: `'('` |
| flankafter | <code>string</code> | Flanking string after the result,    for example: `')'` |

<a name="module_ChromRegion--ChromRegion+overlaps"></a>

#### chromRegion.overlaps(region, [strandSpecific]) ⇒ <code>number</code>
Return the length of overlaps between `this` and any given region.

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| region | <code>ChromRegion</code> | The region to be overlapped with. |
| [strandSpecific] | <code>boolean</code> | Whether this overlap should be strand-    specific. If `true`, regions with different strands will not be    considered as overlapping.    __NOTE:__ Regions without strands will not be affected. Consider    `strand === null` as a wildcard that matches any strand. |

<a name="module_ChromRegion--ChromRegion+assimilate"></a>

#### chromRegion.assimilate(region, [strandSpecific]) ⇒ <code>ChromRegion</code> \| <code>null</code>
Assimilate `region` if `this` overlaps with it by expanding `this` to

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| region | <code>ChromRegion</code> | The region to be assimilated. |
| [strandSpecific] | <code>boolean</code> | Whether the assimilation is    strand-specific. |

<a name="module_ChromRegion--ChromRegion+concat"></a>

#### chromRegion.concat(region, [strandSpecific]) ⇒ <code>ChromRegion</code> \| <code>null</code>
Concatenate `this` with `region`. Concat happens only when the two regions

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| region | <code>ChromRegion</code> | The region to be concatenated |
| [strandSpecific] | <code>boolean</code> | Whether the concatenation is    strand-specific |

<a name="module_ChromRegion--ChromRegion+intersect"></a>

#### chromRegion.intersect(region, [strandSpecific]) ⇒ <code>ChromRegion</code> \| <code>null</code>
Intersect `this` with `region` by removing non-overlapping parts.

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| region | <code>ChromRegion</code> | The region to be overlapped |
| [strandSpecific] | <code>boolean</code> | Whether the intersection is    strand-specific |

<a name="module_ChromRegion--ChromRegion+move"></a>

#### chromRegion.move(distance, [isProportion], [chromInfo]) ⇒ <code>ChromRegion</code>
Move `this` by `distance` given. Use a negative value to move to the

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>number</code> | The distance to be moved |
| [isProportion] | <code>boolean</code> | Whether `distance` is given as an    absolute bp value or a proportion (of `this.length`). |
| [chromInfo] | <code>ChromInfoCollection</code> | The collection of chromosomal    information for clipping purposes. |

<a name="module_ChromRegion--ChromRegion+clone"></a>

#### chromRegion.clone() ⇒ <code>ChromRegion</code>
Returns a clone of `this`, all additional properties will be

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
<a name="module_ChromRegion--ChromRegion+getShift"></a>

#### chromRegion.getShift(distance, [isProportion], [chromInfo]) ⇒ <code>ChromRegion</code>
Get a copy of `this` with shifted location (`this` will not change).

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| distance | <code>number</code> | The shift distance. |
| [isProportion] | <code>boolean</code> | Whether `distance` is given as an    absolute bp value or a proportion (of `this.length`). |
| [chromInfo] | <code>ChromInfoCollection</code> | The collection of chromosomal    information for clipping purposes. |

<a name="module_ChromRegion--ChromRegion+extend"></a>

#### chromRegion.extend(sizeDiff, [center], [isProportion], [chromInfo], [minimumSize]) ⇒ <code>ChromRegion</code>
Extend / Shrink `this`

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| sizeDiff | <code>number</code> | The difference to be extended / shrunk. Use    a positive value to extend and a negative value to shrink. |
| [center] | <code>number</code> | The center point for the extension / shrinkage.    Difference in sizes (additional bases after extension / removed bases    after shrinkage) will be allocated proportionally to the length of    `this` separated by `center`.    Default value is the center of `this`, so that additional bases will be    equally distributed to both ends and removed bases will be equally taken    from both ends.    If `center` is at `this.start`, then all extended bases will be put at    the end and all removed bases will be taken from the end.    If `center` is outside `this`, it will be moved to the closest point    on `this`. |
| [isProportion] | <code>boolean</code> | Whether `sizeDiff` is an absolute bp    value or a proportion of `this.length`. |
| [chromInfo] | <code>ChromInfoCollection</code> | The collection of chromosomal    information for clipping purposes. |
| [minimumSize] | <code>number</code> | The minimum size of the resulting    `ChromRegion` object. |

<a name="module_ChromRegion--ChromRegion+getExtension"></a>

#### chromRegion.getExtension(sizeDiff, [center], [isProportion], [chromInfo], [minimumSize]) ⇒ <code>ChromRegion</code>
Get an extended / shrunk copy of `this`. `this` will not be changed.

**Kind**: instance method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| sizeDiff | <code>number</code> | The difference to be extended / shrunk. Use    a positive value to extend and a negative value to shrink. |
| [center] | <code>number</code> | The center point for the extension / shrinkage. |
| [isProportion] | <code>boolean</code> | Whether `sizeDiff` is an absolute bp    value or a proportion of `this.length`. |
| [chromInfo] | <code>ChromInfoCollection</code> | The collection of chromosomal    information for clipping purposes. |
| [minimumSize] | <code>number</code> | The minimum size of the resulting    `ChromRegion` object. |

<a name="module_ChromRegion--ChromRegion.clipCoordinate"></a>

#### ChromRegion.clipCoordinate(coor, [chromInfo]) ⇒ <code>CoordinateObj</code>
Helper function to clip a coordinate object (see `this.startCoor` or

**Kind**: static method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| coor | <code>CoordinateObj</code> | Coordinate object |
| [chromInfo] | <code>ChromInfoCollection</code> | The collection of chromosomal    information. |

<a name="module_ChromRegion--ChromRegion.isValidChromRegion"></a>

#### ChromRegion.isValidChromRegion(chrRegion, [chromInfo]) ⇒ <code>boolean</code>
Validate whether the region is a valid region.

**Kind**: static method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| chrRegion | <code>ChromRegion</code> \| <code>string</code> | The region to be validated |
| [chromInfo] | <code>ChromInfoCollection</code> | The reference object |

<a name="module_ChromRegion--ChromRegion.compare"></a>

#### ChromRegion.compare(region1, region2) ⇒ <code>number</code>
Compare two `ChromRegion`s

**Kind**: static method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Returns**: <code>number</code> - `0` if `region1` equals to `region2`, `-1` if

| Param | Type |
| --- | --- |
| region1 | <code>ChromRegion</code> | 
| region2 | <code>ChromRegion</code> | 

<a name="module_ChromRegion--ChromRegion.isEqual"></a>

#### ChromRegion.isEqual(region1, region2) ⇒ <code>boolean</code>
Determine whether two regions are equal (`chr`, `start`, `end` are equal)

**Kind**: static method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type |
| --- | --- |
| region1 | <code>ChromRegion</code> | 
| region2 | <code>ChromRegion</code> | 

<a name="module_ChromRegion--ChromRegion._shortenString"></a>

#### ChromRegion.\_shortenString(str, limit, prefixLength, suffixLength) ⇒ <code>string</code>
Helper function to get a shortened string if it exceeds a given limit.

**Kind**: static method of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to be shortened |
| limit | <code>number</code> | Limit of string length |
| prefixLength | <code>number</code> | Prefix length if shortening happens |
| suffixLength | <code>number</code> | Suffix length if shortening happens |

<a name="module_ChromRegion--ChromRegion..ChromInfo"></a>

#### ChromRegion~ChromInfo : <code>Object</code>
Basic chromosome information.

**Kind**: inner typedef of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| chrRegion | <code>ChromRegion</code> | The range of the chromosome |
| [cent] | <code>ChromRegion</code> | The range of the chromosome centromere |

<a name="module_ChromRegion--ChromRegion..ChromInfoCollection"></a>

#### ChromRegion~ChromInfoCollection : <code>Object.&lt;string, ChromInfo&gt;</code>
An dictionary-like object with chromosomal name as keys and `ChromInfo` type

**Kind**: inner typedef of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
<a name="module_ChromRegion--ChromRegion..CoordinateObj"></a>

#### ChromRegion~CoordinateObj : <code>Object</code>
A coordinate object with chromosome name and single coordinate value.

**Kind**: inner typedef of [<code>ChromRegion</code>](#exp_module_ChromRegion--ChromRegion)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| chr | <code>string</code> | The chromosome name |
| coor | <code>number</code> | The coordinate value |
