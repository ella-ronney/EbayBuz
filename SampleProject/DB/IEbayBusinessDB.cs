using SampleProject.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace SampleProject.DB
{
    public interface IEbayBusinessDB
    {
        List<CurrentInventory> GetAllCurrentInventory();
        public List<IncomingInventory> GetAllIncomingInventory();
    }
}
