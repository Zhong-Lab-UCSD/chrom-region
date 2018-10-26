# chrom-region <!-- omit in toc --> 
Chromosomal region class used in GIVE, supporting some basic region operations.

- [Install](#install)
- [Usage](#usage)
- [Testing](#testing)
- [License](#license)
- [Class API Documentation](#class-api-documentation)

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

# License

Copyright 2017-2018 Xiaoyi Cao

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


# Class API Documentation
Please refer to <https://github.com/Zhong-Lab-UCSD/chrom-region/blob/master/chromRegion.md>
