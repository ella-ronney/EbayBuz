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
    }
}
