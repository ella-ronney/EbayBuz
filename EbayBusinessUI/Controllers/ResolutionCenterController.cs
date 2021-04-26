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
    public class ResolutionCenterController : Controller
    {
        private IEbayBusinessDB ebayDBRecords;

        public ResolutionCenterController(IEbayBusinessDB ebayDBRecords)
        {
            this.ebayDBRecords = ebayDBRecords;
        }
        public IActionResult ResolutionCenter()
        {
            return View("~/Views/HtmlPages/ResolutionCenter.cshtml");
        }
        [HttpPost]
        [Route("AddReturn")]
        public bool AddReturn([FromForm] Returns ret)
        {
            if (ebayDBRecords.AddReturns(ret)){
                return true;
            }
            return false;
        }

        [HttpGet]
        [Route("Returns")]
        public ActionResult<List<Returns>> GetAllReturns()
        {
            return ebayDBRecords.GetAllReturns();
        }
    }
}
