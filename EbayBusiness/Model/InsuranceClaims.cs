using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EbayBusiness.Model
{
    public class InsuranceClaims
    {
        [Key]
        public int idinsuranceclaims { get; set; }
        public string itemName { get; set; }
        public string ebayOrderNumber { get; set; }
        public float sellPrice { get; set; }
        public float insuredFor { get; set; }
        public string shippingCarrier { get; set; }
        public string tracking { get; set; }
        public string claimNumber { get; set; }
        public string claimStatus { get; set; }
        public DateTime claimFileDate { get; set; }
        public string customerPreference { get; set; }
        public string customerResolutionStatus { get; set; }
        public string notes { get; set; }
        public string replacementTrackingNum { get; set; }
        public float shippingCost { get; set; }
    }
}
