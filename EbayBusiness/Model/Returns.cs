using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EbayBusiness.Model
{
    public class Returns
    {
        [Key]
        public int idreturns { get; set; }
        public string returnName { get; set; }
        public int quantity { get; set; }
        public float totalPrice { get; set; }
        public string paymentMethod { get; set; }
        public string returnVendor { get; set; }
        public DateTime returnDate { get; set; }
        public DateTime deliveryDate { get; set; }
        public string trackingNum { get; set; }
        public string estimatedRefundTime { get; set; }
    }
}
