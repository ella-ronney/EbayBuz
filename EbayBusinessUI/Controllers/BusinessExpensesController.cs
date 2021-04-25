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
    public class BusinessExpensesController : Controller
    {
        private IEbayBusinessDB ebayDBRecords;

        public BusinessExpensesController(IEbayBusinessDB ebayDBRecords)
        {
            this.ebayDBRecords = ebayDBRecords;
        }
        public IActionResult BusinessExpenses()
        {
            return View("~/Views/HtmlPages/BusinessExpenses.cshtml");
        }

        [HttpPost]
        [Route("AddExpense")]
        public bool AddExpense ([FromForm] BusinessExpenses expense)
        {
            if (ebayDBRecords.AddExpense(expense))
            {
                return true;
            }
            return false;
        }
    }
}
