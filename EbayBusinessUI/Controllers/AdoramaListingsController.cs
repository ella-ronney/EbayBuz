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
        [Route("AddAdoramaListing")]
        public ActionResult<AdoramaListings> AddAdoramaListing([FromForm] AdoramaListings adoramaListing)
        {
            return ebayDBRecords.AddAdoramaListing(adoramaListing);
        }

        [HttpGet]
        [Route("AdoramaListings")]
        public ActionResult<List<AdoramaListings>> GetAllAdoramaListings()
        {
            return ebayDBRecords.GetAllAdoramaListings();
        }
    }
}
