const chai = require('chai')
const dirtyChai = require('dirty-chai')
const ChromRegion = require('../chromRegion')

chai.use(dirtyChai)
const expect = chai.expect

describe('ChromRegion tests: creation, I/O, properties.', function () {
  it('Create new from string.', function () {
    let newChrRegion = new ChromRegion('chr1:12345-67890')
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12344)
    expect(newChrRegion.end).to.equal(67890)
    expect(newChrRegion.strand).to.be.null()
    newChrRegion = new ChromRegion('chr1:12345-67890(.)')
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12344)
    expect(newChrRegion.end).to.equal(67890)
    expect(newChrRegion.strand).to.be.null()
    newChrRegion = new ChromRegion({ bedString: 'chr1 12345 67890' })
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12345)
    expect(newChrRegion.end).to.equal(67890)
    expect(newChrRegion.strand).to.be.null()
    expect(newChrRegion).to.not.haveOwnProperty('bedString')
  })

  it('Create new one-base-long from string.', function () {
    let newChrRegion = new ChromRegion('chr1:12345-12345')
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12344)
    expect(newChrRegion.end).to.equal(12345)
    return expect(newChrRegion.strand).to.be.null()
  })

  it('Create new chromosome-wide region.', function () {
    let chromInfo = {
      chr1: {
        chrRegion: new ChromRegion('chr1: 1 - 2000000')
      },
      chr2: {
        chrRegion: new ChromRegion('chr2: 1 - 2000')
      }
    }
    let newChrRegion = new ChromRegion('chr1', chromInfo)
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(0)
    expect(newChrRegion.end).to.equal(2000000)
    expect(newChrRegion.strand).to.be.null()

    newChrRegion = new ChromRegion('chr2:101-100000', chromInfo)
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr2')
    expect(newChrRegion.start).to.equal(100)
    expect(newChrRegion.end).to.equal(2000)
    expect(newChrRegion.strand).to.be.null()
  })

  it('Create new from invalid stuff.', function () {
    expect(() => new ChromRegion(12345)).to.throw()
    expect(() => new ChromRegion([])).to.throw()
    expect(() => new ChromRegion()).to.throw()
    expect(() => new ChromRegion(undefined)).to.throw()
    expect(() => new ChromRegion('chr1:1')).to.throw()
    // Note: a ChromRegion of length 0 is allowed
    expect(() => new ChromRegion('chr1:123456-123455')).to.not.throw()
    expect(() => new ChromRegion('chr:abc-def')).to.throw()
    expect(() => new ChromRegion('chr:-100-200')).to.throw()
    expect(() => new ChromRegion({ chr: 'chr1', start: undefined })).to.throw()
    expect(() => new ChromRegion({ chr: 'chr1', start: 1, end: -1 })).to.throw()
    expect(() => new ChromRegion({ chr: 'chr1', start: 0, end: -1 })).to.throw()
  })

  it('Create new from string with positive strand.', function () {
    let newChrRegion = new ChromRegion('chr1:12345-67890(+)')
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12344)
    expect(newChrRegion.end).to.equal(67890)
    return expect(newChrRegion.strand).to.be.true()
  })

  it('Create new from string with negative strand.', function () {
    let newChrRegion = new ChromRegion('chr1:12345-67890(-)')
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12344)
    expect(newChrRegion.end).to.equal(67890)
    return expect(newChrRegion.strand).to.be.false()
  })

  it('Create new from a ChromRegion-like object.', function () {
    let chromInfo = {
      chr1: {
        chrRegion: new ChromRegion('chr1: 1 - 20000')
      },
      chr2: {
        chrRegion: new ChromRegion('chr2: 1 - 2000')
      }
    }
    let newChrRegion = new ChromRegion({
      chr: 'chr1',
      start: 1,
      end: 100000,
      someStrangeProperty: 'someStrangePropertyValue'
    })
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.start).to.equal(1)
    expect(newChrRegion.end).to.equal(100000)
    expect(newChrRegion.strand).to.be.null()
    expect(newChrRegion)
      .to.have.property('someStrangeProperty', 'someStrangePropertyValue')
    newChrRegion = new ChromRegion({
      chr: 'chr1',
      start: 0,
      end: 100000,
      strand: '.',
      someStrangeProperty: 'someNewPropertyValue'
    }, chromInfo, {
      someAdditionalProperty: 42
    })
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.start).to.equal(0)
    expect(newChrRegion.end).to.equal(20000)
    expect(newChrRegion.strand).to.be.null()
    expect(newChrRegion)
      .to.have.property('someStrangeProperty', 'someNewPropertyValue')
    expect(newChrRegion)
      .to.have.property('someAdditionalProperty', 42)
    newChrRegion = new ChromRegion({
      bedString: 'chr1 12345 6789000 testRegion 100 -'
    }, chromInfo, {
      someAdditionalProperty: 42
    })
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12345)
    expect(newChrRegion.end).to.equal(20000)
    expect(newChrRegion.strand).to.be.false()
    expect(newChrRegion.name).to.equal('testRegion')
    expect(newChrRegion).to.not.haveOwnProperty('bedString')
    expect(newChrRegion)
      .to.have.property('someAdditionalProperty', 42)
  })

  it('Create new from a ChromRegion-like object with positive strand.',
    function () {
      let newChrRegion = new ChromRegion({
        chr: 'chr1',
        start: 1,
        end: 100000,
        strand: true
      })
      expect(newChrRegion).to.be.instanceOf(ChromRegion)
      expect(newChrRegion.start).to.equal(1)
      expect(newChrRegion.end).to.equal(100000)
      expect(newChrRegion.strand).to.be.true()
      newChrRegion = new ChromRegion({
        chr: 'chr1',
        start: 1,
        end: 100000,
        strand: '+'
      })
      expect(newChrRegion).to.be.instanceOf(ChromRegion)
      expect(newChrRegion.start).to.equal(1)
      expect(newChrRegion.end).to.equal(100000)
      expect(newChrRegion.strand).to.be.true()
      newChrRegion = new ChromRegion({
        chr: 'chr1',
        start: 1,
        end: 100000,
        strand: '1'
      })
      expect(newChrRegion).to.be.instanceOf(ChromRegion)
      expect(newChrRegion.start).to.equal(1)
      expect(newChrRegion.end).to.equal(100000)
      expect(newChrRegion.strand).to.be.true()
    }
  )

  it('Create new from a ChromRegion-like object with negative strand.',
    function () {
      let newChrRegion = new ChromRegion({
        chr: 'chr1',
        start: 1,
        end: 100000,
        strand: false
      })
      expect(newChrRegion).to.be.instanceOf(ChromRegion)
      expect(newChrRegion.start).to.equal(1)
      expect(newChrRegion.end).to.equal(100000)
      expect(newChrRegion.strand).to.be.false()
      newChrRegion = new ChromRegion({
        chr: 'chr1',
        start: 1,
        end: 100000,
        strand: '-'
      })
      expect(newChrRegion).to.be.instanceOf(ChromRegion)
      expect(newChrRegion.start).to.equal(1)
      expect(newChrRegion.end).to.equal(100000)
      expect(newChrRegion.strand).to.be.false()
      newChrRegion = new ChromRegion({
        chr: 'chr1',
        start: 1,
        end: 100000,
        strand: '0'
      })
      expect(newChrRegion).to.be.instanceOf(ChromRegion)
      expect(newChrRegion.start).to.equal(1)
      expect(newChrRegion.end).to.equal(100000)
      expect(newChrRegion.strand).to.be.false()
      newChrRegion = new ChromRegion({
        chr: 'chr1',
        start: 1,
        end: 100000,
        strand: {}
      })
      expect(newChrRegion).to.be.instanceOf(ChromRegion)
      expect(newChrRegion.start).to.equal(1)
      expect(newChrRegion.end).to.equal(100000)
      expect(newChrRegion.strand).to.be.true()
    }
  )

  it('.toString(), .regionToString() and .regionToBed()', function () {
    let newChrRegion = new ChromRegion('chr1:12345-67890(+)')
    expect(newChrRegion.toString()).to.equal('chr1:12345-67890 (+)')
    expect(newChrRegion.regionToString()).to.equal('chr1:12345-67890 (+)')
    expect(newChrRegion.regionToString(false)).to.equal('chr1:12345-67890')
    expect(newChrRegion.regionToBed()).to.equal('chr1\t12344\t67890\t.\t0\t+')
    expect(newChrRegion.regionToBed(false))
      .to.equal('chr1\t12344\t67890\t.')
    newChrRegion = new ChromRegion({
      chr: 'chr1',
      start: 0,
      end: 100000,
      strand: false,
      name: 'testRegion'
    })
    expect(newChrRegion.toString()).to.equal('chr1:1-100000 (-)')
    expect(newChrRegion.regionToString()).to.equal('chr1:1-100000 (-)')
    expect(newChrRegion.regionToString(false)).to.equal('chr1:1-100000')
    expect(newChrRegion.regionToBed())
      .to.equal('chr1\t0\t100000\ttestRegion\t0\t-')
    expect(newChrRegion.regionToBed(false))
      .to.equal('chr1\t0\t100000\ttestRegion')
  })

  it('.clipRegion()', function () {
    let newChrRegion = new ChromRegion('chr1:12345-12346(+)')
    let newChrRegion2 = new ChromRegion('chr2:12345-12346(-)')
    let newChrRegion3 = new ChromRegion('chr3:12345-12346(-)')
    let newChrRegion4 = new ChromRegion({
      chr: 'chr2',
      start: -100,
      end: 1234,
      strand: false
    })
    let chromInfo = {
      chr1: {
        chrRegion: new ChromRegion('chr1: 1 - 2000000')
      },
      chr2: {
        chrRegion: new ChromRegion('chr2: 1 - 2000')
      }
    }
    expect(newChrRegion.clipRegion(chromInfo, 100).toString())
      .to.equal('chr1:12247-12346 (+)')
    expect(newChrRegion.clipRegion(chromInfo).toString())
      .to.equal(newChrRegion.toString())
    newChrRegion = new ChromRegion('chr1:12345-12346(-)')
    expect(newChrRegion.clipRegion(null, 100).toString())
      .to.equal('chr1:12247-12346 (-)')
    expect(newChrRegion2.clipRegion(chromInfo, 100).toString())
      .to.equal('chr2:1901-2000 (-)')
    expect(() => newChrRegion3.clipRegion(chromInfo, 100)).to.throw()
    expect(newChrRegion4.clipRegion(chromInfo).toString())
      .to.equal('chr2:1-1234 (-)')
  })

  it('Properties: length, start, end, startCoor, endCoor', function () {
    let newChrRegion = new ChromRegion('chr1:12345-12346(+)')
    let newChrRegion2 = new ChromRegion('chr1:12347-12346(+)')
    expect(newChrRegion.length).to.equal(2)
    expect(newChrRegion2.length).to.equal(0)
    expect(newChrRegion.startCoor).to.eql({ chr: 'chr1', coor: 12344 })
    expect(newChrRegion.endCoor).to.eql({ chr: 'chr1', coor: 12345 })
    expect(() => (newChrRegion.start = 12310)).to.not.throw()
    expect(newChrRegion.length).to.equal(36)
    expect(newChrRegion.startCoor).to.eql({ chr: 'chr1', coor: 12310 })
    expect(newChrRegion.toString()).to.equal('chr1:12311-12346 (+)')
    expect(() => (newChrRegion.end = 12380)).to.not.throw()
    expect(newChrRegion.length).to.equal(70)
    expect(newChrRegion.endCoor).to.eql({ chr: 'chr1', coor: 12379 })
    expect(newChrRegion.toString()).to.equal('chr1:12311-12380 (+)')
    expect(() => (newChrRegion.start = 21000)).to.throw()
    expect(newChrRegion.length).to.equal(70)
    expect(newChrRegion.startCoor).to.eql({ chr: 'chr1', coor: 12310 })
    expect(newChrRegion.toString()).to.equal('chr1:12311-12380 (+)')
    expect(() => (newChrRegion.end = 11000)).to.throw()
    expect(newChrRegion.length).to.equal(70)
    expect(newChrRegion.startCoor).to.eql({ chr: 'chr1', coor: 12310 })
    expect(newChrRegion.toString()).to.equal('chr1:12311-12380 (+)')
  })

  it('Properties: strand', function () {
    let newChrRegion = new ChromRegion('chr1:12345-12346(+)')
    let newChrRegion2 = new ChromRegion('chr1:12347-12346(-)')
    expect(newChrRegion.strand).to.be.true()
    expect(newChrRegion.getStrand()).to.equal('+')
    expect(newChrRegion.getStrand('[', ']')).to.equal('[+]')
    expect(newChrRegion.getStrand('(', ')')).to.equal('(+)')
    expect(newChrRegion.getStrand('[(', ')]')).to.equal('[(+)]')
    expect(newChrRegion2.strand).to.be.false()
    expect(newChrRegion2.getStrand('[', ']')).to.equal('[-]')
    expect(newChrRegion2.getStrand('(', ')')).to.equal('(-)')
    expect(newChrRegion2.getStrand('[(', ')]')).to.equal('[(-)]')
    newChrRegion.strand = 0
    expect(newChrRegion2.strand).to.be.false()
    newChrRegion2.strand = 1
    expect(newChrRegion2.strand).to.be.true()
    newChrRegion.strand = '1'
    expect(newChrRegion.strand).to.be.true()
    newChrRegion2.strand = '.'
    expect(newChrRegion2.strand).to.be.null()
    expect(newChrRegion2.getStrand('(', ')')).to.be.null()
  })

  it('Properties: shortName', function () {
    let newChrRegion = new ChromRegion({
      chr: 'chr1',
      start: 0,
      end: 100000,
      strand: false,
      name: 'testRegion with an extremely long name'
    })
    expect(newChrRegion.shortName).to.equal('testRe...name')
    let newChrRegion2 = new ChromRegion({
      chr: 'chr1',
      start: 0,
      end: 100000,
      strand: false,
      name: 'testRegion'
    })
    expect(newChrRegion2.shortName).to.equal('testRegion')
  })
})

describe('ChromRegion tests: operations.', function () {
  it('Overlap.', function () {
    let chrRegion0 = new ChromRegion('chr1:12345-12344(+)')
    let chrRegion1 = new ChromRegion('chr1:12345-67890(+)')
    let chrRegion2 = new ChromRegion('chr1:67891-167890(+)')
    let chrRegion3 = new ChromRegion('chr3:60000-77890(+)')
    let chrRegion4 = new ChromRegion('chr1:60000-77890(+)')
    let chrRegion5 = new ChromRegion('chr1:60000-77890(-)')
    let chrRegion6 = new ChromRegion('chr1:60000-77890')
    expect(chrRegion1.overlap(chrRegion2)).to.equal(0)
    expect(chrRegion1.overlap(chrRegion3)).to.equal(0)
    expect(chrRegion1.overlap(chrRegion4)).to.equal(7891)
    expect(chrRegion1.overlap(chrRegion4, true)).to.equal(7891)
    expect(chrRegion1.overlap(chrRegion0)).to.equal(0)
    expect(chrRegion0.overlap(chrRegion2)).to.equal(0)
    expect(chrRegion4.overlap(chrRegion1)).to.equal(7891)
    expect(chrRegion1.overlap(chrRegion5)).to.equal(7891)
    expect(chrRegion1.overlap(chrRegion5, true)).to.equal(0)
    expect(chrRegion1.overlap(chrRegion6)).to.equal(7891)
    expect(chrRegion1.overlap(chrRegion6, true)).to.equal(7891)
  })

  it('Assimilate.', function () {
    let chrRegion1 = new ChromRegion('chr1:12345-67890(+)')
    let chrRegion2 = new ChromRegion('chr1:67891-167890(+)')
    let chrRegion3 = new ChromRegion('chr3:60000-77890(+)')
    let chrRegion4 = new ChromRegion('chr1:60000-77890(+)')
    let chrRegion5 = new ChromRegion('chr1:60000-77890(-)')
    let chrRegion6 = new ChromRegion('chr1:60000-77890')
    expect(chrRegion1.assimilate(chrRegion2)).to.be.null()
    expect(chrRegion1.assimilate(chrRegion2, true)).to.be.null()
    expect(chrRegion1.assimilate(chrRegion2, true, true))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion2, false, true))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion3)).to.be.null()
    expect(chrRegion1.assimilate(chrRegion3, true)).to.be.null()
    expect(chrRegion1.assimilate(chrRegion3, true, true)).to.be.null()
    expect(chrRegion1.assimilate(chrRegion3, false, true)).to.be.null()
    expect(chrRegion1.assimilate(chrRegion4))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion4, true))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion4, true, true))
      .to.be.instanceOf(ChromRegion)
      .and.has.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion4, false, true))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion5))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion5, true)).to.be.null()
    expect(chrRegion1.assimilate(chrRegion5, true, true)).to.be.null()
    expect(chrRegion1.assimilate(chrRegion5, false, true))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion6))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion6, true))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion6, true, true))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
    expect(chrRegion1.assimilate(chrRegion6, false, true))
      .to.be.instanceOf(ChromRegion)
      .and.have.property('length', 155546)
  })

  it('Concat.', function () {
    let chrRegion1 = new ChromRegion('chr1:12345-67890(+)')
    let chrRegion2 = new ChromRegion('chr1:67891-167890(+)')
    let chrRegion3 = new ChromRegion('chr3:60000-77890(+)')
    let chrRegion4 = new ChromRegion('chr1:60000-77890(+)')
    let chrRegion5 = new ChromRegion('chr1:67891-167890(-)')
    let chrRegion6 = new ChromRegion('chr1:67891-167890')
    expect(chrRegion1.concat(chrRegion2)).to.equal(chrRegion1)
    expect(chrRegion1.toString()).to.equal('chr1:12345-167890 (+)')
    chrRegion1 = new ChromRegion('chr1:12345-67890(+)')
    expect(chrRegion1.concat(chrRegion2, true)).to.equal(chrRegion1)
    expect(chrRegion1.toString()).to.equal('chr1:12345-167890 (+)')
    chrRegion1 = new ChromRegion('chr1:12345-67890(+)')
    expect(chrRegion2.concat(chrRegion1)).to.equal(chrRegion2)
    expect(chrRegion2.toString()).to.equal('chr1:12345-167890 (+)')
    expect(chrRegion1.concat(chrRegion3)).to.be.null()
    expect(chrRegion1.concat(chrRegion4)).to.be.null()
    expect(chrRegion1.concat(chrRegion5)).to.equal(chrRegion1)
    expect(chrRegion1.toString()).to.equal('chr1:12345-167890 (+)')
    chrRegion1 = new ChromRegion('chr1:12345-67890(+)')
    expect(chrRegion1.concat(chrRegion5, true)).to.be.null()
    expect(chrRegion1.concat(chrRegion6, true)).to.equal(chrRegion1)
    expect(chrRegion1.toString()).to.equal('chr1:12345-167890 (+)')
  })

  it('Intersect.', function () {
    let chrRegion1 = new ChromRegion('chr1:1-100000(-)')
    let chrRegion2 = new ChromRegion('chr1:2001-40000(-)')
    let chrRegion3 = new ChromRegion('chr1:5001-50000(-)')
    let chrRegion4 = new ChromRegion('chr3:10001-70000(-)')
    let chrRegion5 = new ChromRegion('chr1:20001-30000(+)')
    let chrRegion6 = new ChromRegion('chr1:15001-28000')
    expect(chrRegion2.intersect(chrRegion1, true).toString())
      .to.equal('chr1:2001-40000 (-)')
    expect(chrRegion1.intersect(chrRegion2, true).toString())
      .to.equal('chr1:2001-40000 (-)')
    expect(chrRegion1.intersect(chrRegion3).toString())
      .to.equal('chr1:5001-40000 (-)')
    expect(chrRegion1.intersect(chrRegion4)).to.be.null()
    expect(chrRegion1.toString()).to.equal('chr1:5001-40000 (-)')
    expect(chrRegion1.intersect(chrRegion5, true)).to.be.null()
    expect(chrRegion1.intersect(chrRegion5).toString())
      .to.equal('chr1:20001-30000 (-)')
    expect(chrRegion1.intersect(chrRegion6).toString())
      .to.equal('chr1:20001-28000 (-)')
  })

  it('Minus.', function () {
    let chrRegion1 = new ChromRegion('chr1:1-100000(-)')
    let chrRegion2 = new ChromRegion('chr1:2001-40000(-)')
    let chrRegion3 = new ChromRegion('chr1:5001-50000(-)', null, { name: '3' })
    let chrRegion4 = new ChromRegion('chr3:10001-70000(-)')
    let chrRegion5 = new ChromRegion('chr1:20001-30000(+)')
    let chrRegion6 = new ChromRegion('chr1:15001-28000')
    let chrRegion7 = new ChromRegion('chr1:12001-12000')
    let chrRegion8 = new ChromRegion('chr2:12001-12000')
    let chrRegion9 = new ChromRegion('chr1:12001-12000(+)')
    expect(chrRegion2.getMinus(chrRegion1, true)
      .map(region => region.toString())
    ).to.eql([])
    expect(chrRegion1.getMinus(chrRegion2, true)
      .map(region => region.toString())
    ).to.eql(['chr1:1-2000 (-)', 'chr1:40001-100000 (-)'])
    expect(chrRegion3.getMinus(chrRegion2, true)
      .map(region => region.toString())
    ).to.eql(['chr1:40001-50000 (-)'])
    expect(chrRegion3.getMinus(chrRegion4, true))
      .to.eql([chrRegion3])
    expect(chrRegion3.getMinus(chrRegion4, true))
      .to.eql([chrRegion3])
    expect(chrRegion3.getMinus(chrRegion5))
      .to.eql([
        new ChromRegion('chr1:5001-20000(-)', null, { name: '3' }),
        new ChromRegion('chr1:30001-50000(-)', null, { name: '3' })
      ])
    expect(chrRegion3.getMinus(chrRegion5, true))
      .to.eql([chrRegion3])
    expect(chrRegion3.getMinus(chrRegion6))
      .to.eql([
        new ChromRegion('chr1:5001-15000(-)', null, { name: '3' }),
        new ChromRegion('chr1:28001-50000(-)', null, { name: '3' })
      ])
    expect(chrRegion3.getMinus(chrRegion6, true))
      .to.eql([
        new ChromRegion('chr1:5001-15000(-)', null, { name: '3' }),
        new ChromRegion('chr1:28001-50000(-)', null, { name: '3' })
      ])
    expect(chrRegion3.getMinus(chrRegion7, true))
      .to.eql([
        new ChromRegion('chr1:5001-12000(-)', null, { name: '3' }),
        new ChromRegion('chr1:12001-50000(-)', null, { name: '3' })
      ])
    expect(chrRegion3.getMinus(chrRegion8, true))
      .to.eql([chrRegion3])
    expect(chrRegion3.getMinus(chrRegion9))
      .to.eql([
        new ChromRegion('chr1:5001-12000(-)', null, { name: '3' }),
        new ChromRegion('chr1:12001-50000(-)', null, { name: '3' })
      ])
    expect(chrRegion3.getMinus(chrRegion9, true))
      .to.eql([chrRegion3])
  })

  it('Clone and equality functions.', function () {
    let chrRegion1 = new ChromRegion('chr2:12345-67890(+)', null,
      { name: 'name1' })
    let chrRegion2 = chrRegion1.clone()
    expect(chrRegion1.toString()).to.equal(chrRegion2.toString())
    expect(chrRegion1).to.eql(chrRegion2)
    expect(ChromRegion.isEqual(chrRegion1, chrRegion2)).to.be.true()
    expect(ChromRegion.compare(chrRegion1, chrRegion2)).to.equal(0)
    expect(chrRegion1.equalTo(chrRegion2)).to.be.true()

    let chrRegion3 = new ChromRegion(chrRegion1, null, { name: 'name0' })
    let chrRegion4 = new ChromRegion('chr2:12345-67890', null,
      { name: 'name0' })
    let chrRegion5 = new ChromRegion('chr2:12345-67890(+)', null, { name: '' })
    expect(chrRegion1).not.to.eql(chrRegion3)
    expect(chrRegion1.toString()).to.equal(chrRegion3.toString())
    expect(chrRegion1.equalTo(chrRegion3)).to.be.false()
    expect(ChromRegion.compare(chrRegion1, chrRegion3)).to.equal(1)
    expect(ChromRegion.compare(chrRegion1, chrRegion4)).to.be.equal(-1)
    expect(ChromRegion.compare(chrRegion1, chrRegion5)).to.be.equal(-1)
    expect(ChromRegion.compare(chrRegion5, chrRegion1)).to.be.equal(1)

    chrRegion2.start = 12300
    expect(chrRegion2.toString()).to.equal('chr2:12301-67890 (+)')
    expect(chrRegion1.toString()).to.be.not.equal(chrRegion2.toString())
    expect(ChromRegion.isEqual(chrRegion1, chrRegion2)).to.be.false()
    expect(ChromRegion.compare(chrRegion1, chrRegion2)).to.be.greaterThan(0)
    expect(ChromRegion.compare(chrRegion2, chrRegion1)).to.be.lessThan(0)
    chrRegion2.chr = 'chr10'
    expect(ChromRegion.isEqual(chrRegion1, chrRegion2)).to.be.false()
    expect(ChromRegion.compare(chrRegion1, chrRegion2)).to.be.lessThan(0)
    expect(ChromRegion.compare(chrRegion2, chrRegion1)).to.be.greaterThan(0)

    chrRegion3 = new ChromRegion('chr2:12345-67890(-)', null,
      { name: 'name1' })
    chrRegion4 = new ChromRegion('chr2:12345-67890', null,
      { name: 'name1' })
    chrRegion5 = new ChromRegion('chr2:12345-67890(+)', null,
      { name: 'name1' })
    expect(ChromRegion.isEqual(chrRegion1, chrRegion3)).to.be.false()
    expect(ChromRegion.compare(chrRegion1, chrRegion3)).to.be.equal(-1)
    expect(ChromRegion.isEqual(chrRegion1, chrRegion4)).to.be.false()
    expect(ChromRegion.compare(chrRegion1, chrRegion4)).to.be.equal(-1)
    expect(ChromRegion.compare(chrRegion4, chrRegion3)).to.be.equal(1)
    expect(ChromRegion.isEqual(chrRegion1, chrRegion5)).to.be.true()
    expect(ChromRegion.compare(chrRegion1, chrRegion5)).to.be.equal(0)
    expect(ChromRegion.isEqual(chrRegion1, null)).to.be.false()
    expect(ChromRegion.isEqual(null, chrRegion5)).to.be.false()
    expect(ChromRegion.isEqual(null, null)).to.be.true()
    expect(chrRegion1.equalTo(chrRegion3)).to.be.false()
    expect(chrRegion1.equalTo(chrRegion4)).to.be.false()
    expect(chrRegion1.equalTo(chrRegion5)).to.be.true()
  })

  it('Move and getShift.', function () {
    let chrRegion = new ChromRegion('chr2:1-50000(-)')
    let chromInfo = {
      chr1: {
        chrRegion: new ChromRegion('chr1: 1 - 2000000')
      },
      chr2: {
        chrRegion: new ChromRegion('chr2: 1 - 100000')
      }
    }
    expect(() => chrRegion.move('a', false, chromInfo)).to.throw()
    expect(chrRegion.move(5000, false, chromInfo).toString())
      .to.equal('chr2:5001-55000 (-)')
    expect(chrRegion.move(-3000.5, false, chromInfo).toString())
      .to.equal('chr2:2001-52000 (-)')
    expect(chrRegion.move(500000, false, chromInfo).toString())
      .to.equal('chr2:50001-100000 (-)')
    expect(chrRegion.move(-0.5, true, chromInfo).toString())
      .to.equal('chr2:25001-75000 (-)')
    expect(chrRegion.move(-1, true, chromInfo).toString())
      .to.equal('chr2:1-50000 (-)')

    expect(chrRegion.getShift(0.4, true, chromInfo).toString())
      .to.equal('chr2:20001-70000 (-)')

    expect(chrRegion.move(-4000, false, chromInfo, true).toString())
      .to.equal('chr2:4001-54000 (-)')
    expect(chrRegion.move(1000.5, false, chromInfo, true).toString())
      .to.equal('chr2:3000-52999 (-)')
    expect(chrRegion.move(-0.5, true, chromInfo, true).toString())
      .to.equal('chr2:28000-77999 (-)')
    expect(chrRegion.move(0.1, true, chromInfo, true).toString())
      .to.equal('chr2:23000-72999 (-)')

    expect(chrRegion.getShift(-0.2, true, chromInfo, true).toString())
      .to.equal('chr2:33000-82999 (-)')
    expect(chrRegion.toString()).to.equal('chr2:23000-72999 (-)')
  })

  it('Extend and getExtension.', function () {
    let chrRegion = new ChromRegion('chr2:40001-50000(+)')
    let chromInfo = {
      chr1: {
        chrRegion: new ChromRegion('chr1: 1 - 2000000')
      },
      chr2: {
        chrRegion: new ChromRegion('chr2: 1 - 100000')
      }
    }
    expect(() => chrRegion.extend('a', null, false, chromInfo)).to.throw()
    expect(chrRegion.extend()).to.equal(chrRegion)
    // Center is the center point
    expect(chrRegion.extend(10000, null, false, chromInfo).toString())
      .to.equal('chr2:35001-55000 (+)')
    expect(chrRegion.extend(-19000, null, false, chromInfo).toString())
      .to.equal('chr2:44501-45500 (+)')
    expect(chrRegion.extend(9000, 44500, false, chromInfo).toString())
      .to.equal('chr2:44501-54500 (+)')
    expect(chrRegion.extend(20000, 50500, false, chromInfo).toString())
      .to.equal('chr2:32501-62500 (+)')
    expect(chrRegion.extend(-20000, 43750, false, chromInfo).toString())
      .to.equal('chr2:40001-50000 (+)')
    expect(chrRegion.extend(10000, 0, false, chromInfo).toString())
      .to.equal('chr2:40001-60000 (+)')
    expect(chrRegion.extend(-10000, 70000, false, chromInfo).toString())
      .to.equal('chr2:50001-60000 (+)')
    expect(chrRegion.extend(1.0, 0, true, chromInfo).toString())
      .to.equal('chr2:50001-70000 (+)')
    expect(chrRegion.extend(1.5, null, true, chromInfo).toString())
      .to.equal('chr2:35001-85000 (+)')
    expect(chrRegion.extend(-0.5, 65000, true, chromInfo).toString())
      .to.equal('chr2:50001-75000 (+)')
    expect(chrRegion.extend(-1, 65000, true, chromInfo, 2500).toString())
      .to.equal('chr2:63501-66000 (+)')
    expect(chrRegion.getExtension(0.4, null, true, chromInfo).toString())
      .to.equal('chr2:63001-66500 (+)')
    expect(chrRegion.getExtension(-1, null, true, chromInfo).toString())
      .to.equal('chr2:64750-64750 (+)')
    expect(chrRegion.getExtension(20, 0, true, chromInfo).toString())
      .to.equal('chr2:47501-100000 (+)')
    expect(chrRegion.getExtension(30, 1000000, true, chromInfo).toString())
      .to.equal('chr2:1-77500 (+)')
    expect(chrRegion.getExtension(300, 1000000, true, chromInfo).toString())
      .to.equal('chr2:1-100000 (+)')
    expect(chrRegion.toString()).to.equal('chr2:63501-66000 (+)')
  })

  it('ClipCoordinate.', function () {
    let chrRegion = new ChromRegion('chr2:40001-500000(+)')
    let chrRegion2 = new ChromRegion('chr1:1-500000(+)')
    let chromInfo = {
      chr1: {
        chrRegion: new ChromRegion('chr1: 100001 - 200000')
      },
      chr2: {
        chrRegion: new ChromRegion('chr2: 1 - 100000')
      }
    }
    expect(ChromRegion.clipCoordinate(chrRegion.startCoor, chromInfo))
      .to.eql({ chr: 'chr2', coor: 40000 })
    expect(ChromRegion.clipCoordinate(chrRegion.endCoor, chromInfo))
      .to.eql({ chr: 'chr2', coor: 99999 })
    expect(ChromRegion.clipCoordinate(chrRegion2.startCoor, chromInfo))
      .to.eql({ chr: 'chr1', coor: 100000 })
    expect(ChromRegion.clipCoordinate(chrRegion2.endCoor, chromInfo))
      .to.eql({ chr: 'chr1', coor: 199999 })
    expect(ChromRegion.clipCoordinate({ chr: 'chr3', coor: -1000 }, chromInfo))
      .to.eql({ chr: 'chr3', coor: 0 })
    expect(ChromRegion.clipCoordinate({ chr: 'chr3', coor: 10000 }, chromInfo))
      .to.eql({ chr: 'chr3', coor: 10000 })
  })

  it('IsValidChromRegion.', function () {
    let chrRegion = new ChromRegion('chr2:40001-500000(+)')
    let chrRegion2 = new ChromRegion('chr1:1-500000(-)')
    let chrRegion3 = new ChromRegion('chr3:1-500000(-)')
    let chrRegion4 = new ChromRegion('chr1:400000-500000(+)')
    let chromInfo = {
      chr1: {
        chrRegion: new ChromRegion('chr1: 100001 - 200000')
      },
      chr2: {
        chrRegion: new ChromRegion('chr2: 1 - 100000')
      }
    }
    expect(ChromRegion.isValidChromRegion(chrRegion, chromInfo))
      .to.be.true()
    expect(ChromRegion.isValidChromRegion(chrRegion2, chromInfo))
      .to.be.true()
    expect(ChromRegion.isValidChromRegion(chrRegion3, chromInfo))
      .to.be.false()
    expect(ChromRegion.isValidChromRegion(chrRegion4, chromInfo))
      .to.be.false()
  })
})
