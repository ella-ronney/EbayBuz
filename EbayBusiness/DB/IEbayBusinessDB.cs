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
        public bool UpdateCurrentInventory(List<Inventory> curInventory);
        public List<Inventory> GetAllIncomingInventory();
        public bool AddIncomingInventory(Inventory inv);
        public bool DeleteIncomingInventory(IdList idList);
        public bool UpdateIncomingInventory(List<Inventory> incInv);
        public List<TopSellers> GetAllTopSellers();
        public List<SoldItems> GetAllBadSellers();
        public bool AddBadSeller(SoldItems badSeller);
        public bool DeleteBadSeller(IdList idList);
        public bool AddExpense(BusinessExpenses expense);
        public Returns AddReturns(Returns ret);
        public List<Returns> GetAllReturns();
        public bool DeleteReturn(IdList idList);
        public bool UpdateReturn(List<Returns> updatedReturns);
        public InsuranceClaims AddInsuranceClaim(InsuranceClaims claim);
        public List<InsuranceClaims> GetAllInsuranceClaims();
        public bool DeleteInsuranceClaim(IdList idList);
        public bool UpdateInsuranceClaim(List<InsuranceClaims> updatedClaims);
        public ShippingDelayedPackages shippingDelayedPackage(ShippingDelayedPackages delayedPackage);
        public List<ShippingDelayedPackages> GetShippingDelayedPackages();
        public bool DeleteDelayedPackage(IdList idList);
        public bool UpdateDelayedPackage(List<ShippingDelayedPackages> updatedPackages);
        public AdoramaListings AddAdoramaListing(AdoramaListings adoramaListing);
        public List<AdoramaListings> GetAllAdoramaListings();
    }
}
