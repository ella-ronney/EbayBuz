using EbayBusiness.Model.Items;
using SampleProject.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace SampleProject.DB
{
    public interface IEbayBusinessDB
    {
        public List<CurrentInventory> GetAllCurrentInventory();
        public bool DeleteCurrentInventory(IdList idList);
        public List<CurrentInventory> MoveIncomingInvToCurrentInv(IdList incomingInvIdList);
        public List<IncomingInventory> GetAllIncomingInventory();
        public bool AddIncomingInventory(IncomingInventory inv);
        public bool DeleteIncomingInventory(IdList idList);
        public List<TopSellers> GetAllTopSellers();
    }
}
