using EbayBusiness.DB;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EbayBusinessUI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProfitController : Controller
    {
        private IEbayBusinessDB ebayDBRecords;

        public ProfitController(IEbayBusinessDB ebayDBRecords)
        {
            this.ebayDBRecords = ebayDBRecords;
        }
        public IActionResult Profit()
        {
            return View("~/Views/HtmlPages/Profit.cshtml");
        }
    }
}
