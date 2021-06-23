using EbayBusiness.DB;
using EbayBusiness.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EbayBusinessUI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdoramaListingsController : Controller
    {
        private IEbayBusinessDB ebayDBRecords;

        public AdoramaListingsController(IEbayBusinessDB ebayDBRecords)
        {
            this.ebayDBRecords = ebayDBRecords;
        }
        public IActionResult AdoramaListings()
        {
            return View("~/Views/HtmlPages/AdoramaListings.cshtml");
        }

        [HttpPost]
        [Route("AddJamoListing")]
        public ActionResult<AdoramaListings> AddJamoListing([FromBody] AdoramaListings adoramaListing)
        {
            return ebayDBRecords.AddJamoListing(adoramaListing);
        }

        [HttpDelete]
        [Route("DeleteJamoListing")]
        public bool DeleteJamoListing([FromBody] IdList jamoIds)
        {
            return ebayDBRecords.DeleteJamoListing(jamoIds);
        }

        [HttpPut]
        [Route("InactivateJamoListing")]

        public bool InactivateJamoListing([FromBody] IdList jamoIds)
        {
            return ebayDBRecords.InactivateJamoListing(jamoIds);
        }

        [HttpGet]
        [Route("AdoramaListings")]
        public ActionResult<List<AdoramaListings>> GetAllAdoramaListings()
        {
            return ebayDBRecords.GetAllAdoramaListings();
        }

        [HttpPost]
        [Route("AddKlipschListing")]
        public ActionResult<AdoramaListings> AddKlipschListing([FromBody] AdoramaListings adoramaListing)
        {
            return ebayDBRecords.AddKlipschListing(adoramaListing);
        }

        [HttpDelete]
        [Route("DeleteKlipschListing")]
        public bool DeleteKlipschListing([FromBody] IdList klipschIds)
        {
            return ebayDBRecords.DeleteKlipschListing(klipschIds);
        }

        [HttpPut]
        [Route("InactivateKlipschListing")]
        public ActionResult<List<AdoramaListings>> InactivateKlipschListing([FromBody] IdList klipschIds)
        {
            return ebayDBRecords.InactivateKlipschListing(klipschIds);
        }

        [HttpPut]
        [Route("ActivateAdoramaListing")]
        public ActionResult<List<AdoramaListings>> MakeAdoramaListingActive(IdList adoramaListingIds)
        {
            return ebayDBRecords.MakeAdoramaListingActive(adoramaListingIds);
        }

        [HttpPost]
        [Route("AddMiscListing")]
        public ActionResult<AdoramaListings> AddMiscListing([FromBody] AdoramaListings miscListing)
        {
            return ebayDBRecords.AddMiscListing(miscListing);
        }

        [HttpDelete]
        [Route("DeleteMiscListing")]
        public bool DeleteMiscListing([FromBody] IdList miscIds)
        {
            return ebayDBRecords.DeleteMiscListing(miscIds);
        }

        [HttpPut]
        [Route("InactivateMiscListing")]
        public bool InactivateMiscListing([FromBody] IdList miscIds)
        {
            return ebayDBRecords.InactivateMiscListing(miscIds);
        }
    }
}
