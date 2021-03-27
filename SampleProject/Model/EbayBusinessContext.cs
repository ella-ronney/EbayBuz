using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace SampleProject.Model
{
    public class EbayBusinessContext : DbContext
    {
        public EbayBusinessContext(DbContextOptions<EbayBusinessContext> options) : base(options)
        {

        }

        public virtual DbSet<CurrentInventory> Currentinventory { get; set; }
        public virtual DbSet<IncomingInventory> IncomingInventory { get; set; }
    }
}
