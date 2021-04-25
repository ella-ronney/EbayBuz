using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EbayBusiness.Model
{
    public class IncomingInventory : Item
    {
        [Key]
        public int idIncomingInventory { get; set; }
        public string trackingNumber { get; set; }
    }
}
