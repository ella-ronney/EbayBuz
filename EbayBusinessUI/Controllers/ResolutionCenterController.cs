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

        //Returns
        [HttpPost]
        [Route("AddReturn")]
        public Returns AddReturn([FromForm] Returns ret)
        {
            return ebayDBRecords.AddReturns(ret);
        }

        [HttpGet]
        [Route("Returns")]
        public ActionResult<List<Returns>> GetAllReturns()
        {
            return ebayDBRecords.GetAllReturns();
        }

        [HttpPost]
        [Route("DeleteReturn")]
        public bool DeleteReturn(IdList returnIdList)
        {
            return ebayDBRecords.DeleteReturn(returnIdList);
        }

        [HttpPut]
        [Route("UpdateReturn")]
        public bool UpdateReturn([FromBody] List<Returns> returns)
        {
            return ebayDBRecords.UpdateReturn(returns);
        }

        // Insurance Claims
        [HttpPost]
        [Route("AddInsuranceClaim")]
        public InsuranceClaims AddInsuranceClaim([FromForm] InsuranceClaims claim)
        {
            return ebayDBRecords.AddInsuranceClaim(claim);
        }

        [HttpGet]
        [Route("InsuranceClaims")]
        public ActionResult<List<InsuranceClaims>> GetAllInsuranceClaims()
        {
            return ebayDBRecords.GetAllInsuranceClaims();
        }

        [HttpPost]
        [Route("DeleteInsuranceClaim")]
        public bool DeleteInsuranceClaim(IdList claimIdList)
        {
            return ebayDBRecords.DeleteInsuranceClaim(claimIdList);
        }

        [HttpPut]
        [Route("UpdateInsuranceClaim")]
        public bool UpdateInsuranceClaim([FromBody] List<InsuranceClaims> insuranceClaims)
        {
            return ebayDBRecords.UpdateInsuranceClaim(insuranceClaims);
        }

        // Delayed packages
        [HttpPost]
        [Route("AddDelayedPackage")]
        public ShippingDelayedPackages AddShippingDelayedPackage([FromForm]ShippingDelayedPackages delayedPackage)
        {
            return ebayDBRecords.shippingDelayedPackage(delayedPackage);
        }
        [HttpGet]
        [Route("DelayedPackages")]
        public ActionResult<List<ShippingDelayedPackages>> GetAllDelayedPackages()
        {
            return ebayDBRecords.GetShippingDelayedPackages();
        }

        [HttpPost]
        [Route("DeleteDelayedPackage")]
        public bool DeleteDelayedPackage(IdList delayedPackageIdList)
        {
            return ebayDBRecords.DeleteDelayedPackage(delayedPackageIdList);
        }

        [HttpPut]
        [Route("UpdateDelayedPackage")]
        public bool UpdateDelayedPackage([FromBody] List<ShippingDelayedPackages> delayedPackage) {
            return ebayDBRecords.UpdateDelayedPackage(delayedPackage); }
    }
}
