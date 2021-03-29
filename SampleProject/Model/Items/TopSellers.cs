using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EbayBusiness.Model.Items
{
    public class TopSellers
    {
        [Key]
        public int idTopSellers { get; set; }
        public string tname { get; set; }
        public float priceSold { get; set; }
        public float purchasePrice { get; set; }
        public string vendors { get; set; }
    }
}
