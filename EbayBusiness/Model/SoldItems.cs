using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EbayBusiness.Model
{
    public class SoldItems
    {
        [Key]
        public int idsolditems { get; set; }
        public string itemName { get; set; }
        public string priceSold { get; set; }
        public string pastVendors { get; set; }
        public string category { get; set; }
    }
}
