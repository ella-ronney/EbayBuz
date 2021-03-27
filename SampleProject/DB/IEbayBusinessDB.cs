using SampleProject.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace SampleProject.DB
{
    public interface IEbayBusinessDB
    {
        public List<CurrentInventory> GetAllCurrentInventory();
        public List<IncomingInventory> GetAllIncomingInventory();
        public bool AddIncomingInventory(IncomingInventory inv);
    }
}
