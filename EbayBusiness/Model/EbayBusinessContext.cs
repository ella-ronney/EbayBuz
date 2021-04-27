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

        public virtual DbSet<CurrentInventory> Currentinventory { get; set; }
        public virtual DbSet<IncomingInventory> IncomingInventory { get; set; }

        public virtual DbSet<TopSellers> TopSellers { get; set; }
        public virtual DbSet<BusinessExpenses> BusinessExpenses { get; set; }
        public virtual DbSet<Returns> Returns { get; set; }
        public virtual DbSet<InsuranceClaims> InsuranceClaims { get; set; }


    }
}
