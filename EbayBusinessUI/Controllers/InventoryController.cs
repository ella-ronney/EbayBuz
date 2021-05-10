using Microsoft.AspNetCore.Mvc;
using EbayBusiness.DB;
using EbayBusiness.Model;
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
        public ActionResult<List<Inventory>> GetAllCurrentInventory()
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

        [HttpPut]
        [Route("MoveToCurrentInventory")]
        public ActionResult<List<Inventory>> MoveIncomingInvToCurrentInv(IdList incomingInvIdList)
        {
            return ebayDBRecords.MoveIncomingInvToCurrentInv(incomingInvIdList);
        }

        [HttpPut]
        [Route("UpdateCurrentInv")]
        public bool UpdateCurrentInventory([FromBody] List<Inventory> curInventory) {
            return ebayDBRecords.UpdateCurrentInventory(curInventory);
        }

        // Incoming Inventory Requests
        [HttpGet]
        [Route("IncomingInventory")]
        public ActionResult<List<Inventory>> GetAllIncomingInventory()
        {
            return ebayDBRecords.GetAllIncomingInventory();
        }

        [HttpPost]
        [Route("AddIncomingInventory")]
        public ActionResult<Inventory> AddIncomingInventory([FromForm] Inventory inv)
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

        [HttpPut]
        [Route("UpdateIncomingInv")]
        public bool UpdateIncomingInventory([FromBody] List<Inventory> incInv)
        {
            return ebayDBRecords.UpdateIncomingInventory(incInv);
        }
    }
}
