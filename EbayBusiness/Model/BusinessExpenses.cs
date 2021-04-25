using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EbayBusiness.Model
{
    public class BusinessExpenses
    {
        [Key]
        public int idBusinessExpenses { get; set; }
        public string expenseName { get; set; }
        public string expenseCategory { get; set; }
        public float cost { get; set; }
        public string paymentInfo { get; set; }
        public DateTime purchaseDate { get; set; }
        public int percentTowardTaxReturn { get; set; }


    }
}
