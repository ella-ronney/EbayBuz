using System;
using System.Collections.Generic;
using System.Text;

namespace EbayBusiness
{
    public abstract class Item
    {
        public string name { get; set; }
        // FIXME - restriction - boundary +#
        public int qty { get; set; }
        // FIXME - restriction - boundary +#
        public float price { get; set; }
        // FIXME use as a key to link to another table
        public string vendor { get; set; }
        public DateTime purchaseDate { get; set; }
        // FIXME - warranty to either be a int / string?
        public string warranty { get; set; }
        // FIXME - restriction - boundary +#
        public string serialNumbers { get; set; }
    }
}
