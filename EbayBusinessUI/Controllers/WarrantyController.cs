using Microsoft.AspNetCore.Mvc;
using EbayBusiness.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EbayBusinessUI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WarrantyController : Controller
    {
        private IEbayBusinessDB ebayDBRecords;

        public WarrantyController(IEbayBusinessDB ebayDBRecords)
        {
            this.ebayDBRecords = ebayDBRecords;
        }
        public IActionResult Warranty()
        {
            return View("~/Views/HtmlPages/Warranty.cshtml");
        }
    }
}
