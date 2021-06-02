using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EbayBusiness.Model
{
    public class AdoramaListings
    {
        [Key]
        public int idadoramalistings { get; set; }
        public string listingName { get; set; }
        public float specialPrice { get; set; }
        public string url { get; set; }
        public string manufacture { get; set; }
        public int active { get; set; }

    }
}
