using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EbayBusiness.Model
{
    public class ShippingDelayedPackages
    {
        [Key]
        public int idshippingdelayedpackages {get; set;}
        public string packageName { get; set; }
        public string ebayOrderNum { get; set; }
        public string carrier { get; set; }
        public int insuranceVal { get; set; }
        public string trackingId { get; set; }
        public DateTime lastScanDate { get; set; }
        public string currentLoc { get; set; }
        public string destination { get; set; }
        public string serviceReqNum { get; set; }
        public DateTime lastCustomerContactDate { get; set; }
        public string note { get; set; }

    }
}
