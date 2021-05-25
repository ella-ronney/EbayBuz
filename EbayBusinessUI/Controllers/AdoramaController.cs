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
    public class AdoramaController : Controller
    {
        private IEbayBusinessDB ebayDBRecords;

        public AdoramaController(IEbayBusinessDB ebayDBRecords)
        {
            this.ebayDBRecords = ebayDBRecords;
        }
        public IActionResult Adorama()
        {
            return View("~/Views/HtmlPages/Adorama.cshtml");
        }
    }
}
