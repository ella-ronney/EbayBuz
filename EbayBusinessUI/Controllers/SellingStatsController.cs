using EbayBusiness.Model.Items;
using Microsoft.AspNetCore.Mvc;
using EbayBusiness.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EbayBusiness.Model;

namespace EbayBusinessUI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SellingStatsController : Controller
    {
        private IEbayBusinessDB ebayDBRecords;

        public SellingStatsController(IEbayBusinessDB ebayDBRecords)
        {
            this.ebayDBRecords = ebayDBRecords;
        }
        public IActionResult SellingStats()
        {
            return View("~/Views/HtmlPages/SellingStats.cshtml");
        }

        [HttpGet]
        [Route("GetTopSellers")]
        public ActionResult<List<TopSellers>> GetAllTopSellers()
        {
            return ebayDBRecords.GetAllTopSellers();
        }

        [HttpGet]
        [Route("GetBadSellers")]
        public ActionResult<List<SoldItems>> GetAllBadSellers()
        {
            return ebayDBRecords.GetAllBadSellers();
        }

        [HttpPost]
        [Route("AddBadSeller")]
        public ActionResult<SoldItems> AddBadSeller([FromBody] SoldItems badSeller)
        {
          if (ebayDBRecords.AddBadSeller(badSeller))
            {
                return badSeller;
            }
            return null;
        }
        
        [HttpDelete]
        [Route("DeleteBadSeller")]
        public bool DeleteBadSeller(IdList idList)
        {
            if (ebayDBRecords.DeleteBadSeller(idList))
            {
                return true;
            }
            return false;
        }

    }
}
