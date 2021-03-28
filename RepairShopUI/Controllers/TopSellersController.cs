using Microsoft.AspNetCore.Mvc;
using SampleProject.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EbayBusinessUI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TopSellersController : Controller
    {
        private IEbayBusinessDB ebayDBRecords;

        public TopSellersController(IEbayBusinessDB ebayDBRecords)
        {
            this.ebayDBRecords = ebayDBRecords;
        }
        public IActionResult TopSellers()
        {
            return View("~/Views/HtmlPages/TopSellers.cshtml");
        }
    }
}
