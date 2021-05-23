using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EbayBusiness.Model
{
    public class Inventory
    {
        [Key]
        public int idInventory { get; set; }
        public string name { get; set; }
        public int qty { get; set; }
        public float pricePerPiece {get;set;}
        public float totalPrice { get; set; }
        public string discountType { get; set; }
        public float discount { get; set; }
        public string discountStatus { get; set; }
        public string vendor { get; set; }
        public DateTime datePurchased { get; set; }
        public string payment { get; set; }
        public string warranty { get; set; }
        public string classification { get; set; }
        public int currentInventory { get; set; }

        // current inventory only 
        public DateTime returnBy { get; set; }
        public string ebayItemId { get; set; }

        // incoming inventory only 
        public DateTime estimatedDelivery { get; set; }
        public string trackingNumber { get; set; }
    }
}
