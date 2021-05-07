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
        public List<Inventory> GetAllCurrentInventory();
        public bool DeleteCurrentInventory(IdList idList);
        public List<Inventory> MoveIncomingInvToCurrentInv(IdList incomingInvIdList);
        public List<Inventory> GetAllIncomingInventory();
        public bool AddIncomingInventory(Inventory inv);
        public bool DeleteIncomingInventory(IdList idList);
        public List<TopSellers> GetAllTopSellers();
        public bool AddExpense(BusinessExpenses expense);
        public Returns AddReturns(Returns ret);
        public List<Returns> GetAllReturns();
        public bool DeleteReturn(IdList idList);
        public InsuranceClaims AddInsuranceClaim(InsuranceClaims claim);
        public List<InsuranceClaims> GetAllInsuranceClaims();
        public bool DeleteInsuranceClaim(IdList idList);
        public ShippingDelayedPackages shippingDelayedPackage(ShippingDelayedPackages delayedPackage);
        public List<ShippingDelayedPackages> GetShippingDelayedPackages();
        public bool DeleteDelayedPackage(IdList idList);
    }
}
