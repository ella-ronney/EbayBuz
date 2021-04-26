using EbayBusiness.Model;
using EbayBusiness.Model.Items;
using EbayBusiness.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace EbayBusiness.DB
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
        public bool AddExpense(BusinessExpenses expense);
        public bool AddReturns(Returns ret);
        public List<Returns> GetAllReturns();
    }
}
