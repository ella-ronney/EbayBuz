using EbayBusiness.Model;
using EbayBusiness.Model.Items;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace EbayBusiness.Model
{
    public class EbayBusinessContext : DbContext
    {
        public EbayBusinessContext(DbContextOptions<EbayBusinessContext> options) : base(options)
        {

        }

        public virtual DbSet<Inventory> Inventory { get; set; }

        public virtual DbSet<TopSellers> TopSellers { get; set; }
        public virtual DbSet<BusinessExpenses> BusinessExpenses { get; set; }
        public virtual DbSet<Returns> Returns { get; set; }
        public virtual DbSet<InsuranceClaims> InsuranceClaims { get; set; }
        public virtual DbSet<ShippingDelayedPackages> ShippingDelayedPackages { get; set; }
        public virtual DbSet<SoldItems> SoldItems { get; set; }


    }
}
