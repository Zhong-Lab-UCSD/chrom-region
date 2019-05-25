const chai = require('chai')
const dirtyChai = require('dirty-chai')
const ChromRegion = require('../chromRegion')

chai.use(dirtyChai)
const expect = chai.expect

describe('ChromRegion tests.', function () {
  it('Create new ChromRegion from string.', function () {
    let newChrRegion = new ChromRegion('chr1:12345-67890')
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12344)
    expect(newChrRegion.end).to.equal(67890)
    newChrRegion = new ChromRegion('chr1:12345-67890(.)')
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12344)
    expect(newChrRegion.end).to.equal(67890)
    return expect(newChrRegion.strand).to.be.null()
  })

  it('Create new ChromRegion from invalid stuff.', function () {
    expect(() => new ChromRegion(12345)).to.throw()
    expect(() => new ChromRegion([])).to.throw()
    expect(() => new ChromRegion()).to.throw()
    expect(() => new ChromRegion(undefined)).to.throw()
    expect(() => new ChromRegion('chr1:1')).to.throw()
    expect(() => new ChromRegion('chr:abc-def')).to.throw()
    expect(() => new ChromRegion({ chr: 'chr1', start: undefined })).to.throw()
    expect(() => new ChromRegion({ chr: 'chr1', start: 1, end: -1 })).to.throw()
  })

  it('Create new ChromRegion from string with positive strand.', function () {
    let newChrRegion = new ChromRegion('chr1:12345-67890(+)')
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12344)
    expect(newChrRegion.end).to.equal(67890)
    return expect(newChrRegion.strand).to.be.true()
  })

  it('Create new ChromRegion from string with negative strand.', function () {
    let newChrRegion = new ChromRegion('chr1:12345-67890(-)')
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.chr).to.equal('chr1')
    expect(newChrRegion.start).to.equal(12344)
    expect(newChrRegion.end).to.equal(67890)
    return expect(newChrRegion.strand).to.be.false()
  })

  it('Create new ChromRegion from a ChromRegion-like object.', function () {
    let newChrRegion = new ChromRegion({
      chr: 'chr1',
      start: 1,
      end: 100000
    })
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.start).to.equal(1)
    expect(newChrRegion.end).to.equal(100000)
    expect(newChrRegion.strand).to.be.null()
    newChrRegion = new ChromRegion({
      chr: 'chr1',
      start: 1,
      end: 100000,
      strand: '.'
    })
    expect(newChrRegion).to.be.instanceOf(ChromRegion)
    expect(newChrRegion.start).to.equal(1)
    expect(newChrRegion.end).to.equal(100000)
    expect(newChrRegion.strand).to.be.null()
  })

  it('Create new ChromRegion from a ChromRegion-like object with positive strand.',
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

  it('Create new ChromRegion from a ChromRegion-like object with negative strand.',
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
    }
  )

  it('ChromRegion.toString()', function () {
    let newChrRegion = new ChromRegion('chr1:12345-67890(+)')
    expect(newChrRegion.toString()).to.equal('chr1:12345-67890 (+)')
    expect(newChrRegion.regionToString()).to.equal('chr1:12345-67890 (+)')
    expect(newChrRegion.regionToString(false)).to.equal('chr1:12345-67890')
    newChrRegion = new ChromRegion({
      chr: 'chr1',
      start: 0,
      end: 100000,
      strand: false
    })
    expect(newChrRegion.toString()).to.equal('chr1:1-100000 (-)')
    expect(newChrRegion.regionToString()).to.equal('chr1:1-100000 (-)')
    expect(newChrRegion.regionToString(false)).to.equal('chr1:1-100000')
  })

  it('ChromRegion.clipRegion()', function () {
    let newChrRegion = new ChromRegion('chr1:12345-12346(+)')
    let newChrRegion2 = new ChromRegion('chr2:12345-12346(-)')
    let newChrRegion3 = new ChromRegion('chr3:12345-12346(-)')
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
    newChrRegion = new ChromRegion('chr1:12345-12346(-)')
    expect(newChrRegion.clipRegion(null, 100).toString())
      .to.equal('chr1:12247-12346 (-)')
    expect(newChrRegion2.clipRegion(chromInfo, 100).toString())
      .to.equal('chr2:1901-2000 (-)')
    expect(() => newChrRegion3.clipRegion(chromInfo, 100)).to.throw()
  })
})
