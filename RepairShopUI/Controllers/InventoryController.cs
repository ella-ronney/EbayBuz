using Microsoft.AspNetCore.Mvc;
using SampleProject.DB;
using SampleProject.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EbayBusiness.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InventoryController : Controller {
        private IEbayBusinessDB ebayDBRecords;

        public InventoryController(IEbayBusinessDB ebayDBRecords)
        {
            this.ebayDBRecords = ebayDBRecords;
        }
        public IActionResult Inventory()
        {
            return View("~/Views/HtmlPages/Inventory.cshtml");
        }

        // Current Inventory Requests
        [HttpGet]
        [Route("CurrentInventory")]
        public ActionResult<List<CurrentInventory>> GetAllCurrentInventory()
        {
            return ebayDBRecords.GetAllCurrentInventory();
        }

        [HttpPost]
        [Route("DeleteCurrentInventory")]
        public bool DeleteCurrentInventory(IdList idList)
        {
            if (ebayDBRecords.DeleteCurrentInventory(idList))
            {
                return true;
            }
            return false;
        }

        [HttpPost]
        [Route("MoveToCurrentInventory")]
        public ActionResult<List<CurrentInventory>> MoveIncomingInvToCurrentInv(IdList incomingInvIdList)
        {
            return ebayDBRecords.MoveIncomingInvToCurrentInv(incomingInvIdList);
        }

        // Incoming Inventory Requests
        [HttpGet]
        [Route("IncomingInventory")]
        public ActionResult<List<IncomingInventory>> GetAllIncomingInventory()
        {
            return ebayDBRecords.GetAllIncomingInventory();
        }

        [HttpPost]
        [Route("AddIncomingInventory")]
        public ActionResult<IncomingInventory> AddIncomingInventory([FromForm] IncomingInventory inv)
        {
            if (ebayDBRecords.AddIncomingInventory(inv))
            {
                return inv;
            }
            return null;

        }

        [HttpPost]
        [Route("DeleteIncomingInventory")]
        public bool DeleteIncomingInventory(IdList idList)
        {
           if (ebayDBRecords.DeleteIncomingInventory(idList))
            {
                return true;
            }
            return false;
        }
    }
}
