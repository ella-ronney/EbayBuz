using SampleProject.Helper;
using SampleProject.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SampleProject.DB
{
    public class EbayBusinessDB : IEbayBusinessDB
    {
        private EbayBusinessContext db;
        private DBObjectCreater objGen = new DBObjectCreater();
        public EbayBusinessDB(EbayBusinessContext db)
        {
           this.db = db;
        }

        // Current Inventory Requests
        public List<CurrentInventory> GetAllCurrentInventory()
        {
            return db.Currentinventory.ToList();
        }

        // Incoming Inventory Requests
        public List<IncomingInventory> GetAllIncomingInventory()
        {
            return db.IncomingInventory.ToList();
        }

        public bool AddIncomingInventory(IncomingInventory inv)
        {
            db.IncomingInventory.Add(inv);
            db.SaveChanges();
            return true;
        }
    }
}
