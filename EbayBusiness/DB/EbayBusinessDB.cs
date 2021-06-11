using EbayBusiness.Helper;
using EbayBusiness.Model;
using EbayBusiness.Model.Items;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EbayBusiness.DB
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
        public List<Inventory> GetAllCurrentInventory()
        {
            try
            {
                // The database is empty
                if (db.Inventory == null)
                {
                    return null;
                }
                return HelperMethods.GetCurrentorIncomingInventory(db.Inventory.ToList(), 1);
               // return HelperMethods.GetCurrentorIncomingInventory(db.Inventory.ToList(), 1);
            }
            catch(Exception ex)
            {
                // FIXME log the error
                return null;
            }
        }

        public bool DeleteCurrentInventory(IdList idList)
        {
            if (!HelperMethods.NullCheckForIdListIds(idList))
            {
                return false;
            }

            try
            {
                int[] currentInventoryIds = idList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int id in currentInventoryIds)
                {
                    var item = db.Inventory.Where(x => x.idInventory == id).FirstOrDefault();
                    if (item == null)
                    {
                        return false;
                    }
                    db.Inventory.Remove(item);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }
            return true;
        }

        public List<Inventory> MoveIncomingInvToCurrentInv(IdList incomingInvIdList)
        {

            if (!HelperMethods.NullCheckForIdListIds(incomingInvIdList))
            {
                return null;
            }

            List<Inventory> currInvList = new List<Inventory>();
            try
            {
                int[] incomingInventoryIds = incomingInvIdList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int id in incomingInventoryIds)
                {
                    var item = db.Inventory.Where(x => x.idInventory == id).FirstOrDefault();
                    if (item == null)
                    {
                        return null;
                    }
                    item.currentInventory = 1;
                    currInvList.Add(item);
                    db.Inventory.Update(item);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return null;
            }
            return currInvList;
        }
        private void updateDbInventoryHelper(ref Inventory dbInventoryItem, Inventory item)
        {
            dbInventoryItem.name = item.name;
            dbInventoryItem.qty = item.qty;
            dbInventoryItem.totalPrice = item.totalPrice;
            dbInventoryItem.discount = item.discount;
            dbInventoryItem.discountStatus = item.discountStatus;
            dbInventoryItem.classification = item.classification;

            if (item.currentInventory == 1)
            {
                dbInventoryItem.returnBy = item.returnBy;
            }

            dbInventoryItem.estimatedDelivery = item.estimatedDelivery;
            dbInventoryItem.trackingNumber = item.trackingNumber;
        }

        public bool UpdateCurrentInventory(List<Inventory> curInventory)
        {
            Inventory dbInventoryItem = null;
            try
            {
                foreach (Inventory item in curInventory)
                {
                    dbInventoryItem = db.Inventory.Where(x => x.idInventory == item.idInventory).FirstOrDefault();
                    if (dbInventoryItem == null)
                    {
                        // Error message popup if the update failed
                        return false;
                    }
                    updateDbInventoryHelper(ref dbInventoryItem, item);
                    db.Inventory.Update(dbInventoryItem);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }

            return true;
        }

        // Incoming Inventory Requests
        public List<Inventory> GetAllIncomingInventory()
        {
            try
            {
                if (db.Inventory == null)
                {
                    return null;
                }

                return HelperMethods.GetCurrentorIncomingInventory(db.Inventory.ToList(), 0);
            }
            catch(Exception ex)
            {
                // FIXME log error
                return null;
            }
        }

        public bool AddIncomingInventory(Inventory inv)
        {
            // FIXME add a validator for all of the inv attributes - before adding to the db... do for all add statements
            if (inv != null)
            {
                db.Inventory.Add(inv);
                db.SaveChanges();
                return true;
            }
            return false;
        }

        public bool DeleteIncomingInventory(IdList idList)
        {
            if (!HelperMethods.NullCheckForIdListIds(idList))
            {
                return false;
            }

            try
            {
                int[] incomingInventoryIds = idList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int id in incomingInventoryIds)
                {
                    var item = db.Inventory.Where(x => x.idInventory == id).FirstOrDefault();
                    if (item == null)
                    {
                        return false;
                    }
                    db.Inventory.Remove(item);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }
            return true;
        }

        public bool UpdateIncomingInventory(List<Inventory> incInv)
        {
            Inventory dbInventoryItem = null;
            try
            {
                foreach (Inventory item in incInv)
                {
                    dbInventoryItem = db.Inventory.Where(x => x.idInventory == item.idInventory).FirstOrDefault();
                    if (dbInventoryItem == null)
                    {
                        return false;
                    }
                    updateDbInventoryHelper(ref dbInventoryItem, item);
                    db.Inventory.Update(dbInventoryItem);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }
            return true;
        }

        // Top sellers
        public List<TopSellers> GetAllTopSellers()
        {
            if (db.TopSellers == null)
            {
                return null;
            }

            return db.TopSellers.ToList();
        }

        public List<SoldItems> GetAllBadSellers()
        {
            if (db.SoldItems == null)
            {
                return null;
            }
            //return db.SoldItems.ToList();
            // FIXME changed the table name
            return null; 
        }

        // FIXME - error handling + validator
        public bool AddBadSeller(SoldItems badSeller)
        {
            if (badSeller != null)
            {
                db.SoldItems.Add(badSeller);
                db.SaveChanges();
                return true;
            }
            return false;
        }

        public bool DeleteBadSeller(IdList idList)
        {
            if (!HelperMethods.NullCheckForIdListIds(idList))
            {
                return false;
            }

            try
            {
                int[] badSellerIds = idList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int id in badSellerIds)
                {
                    var badSeller = db.SoldItems.Where(x => x.idsolditems == id).FirstOrDefault();
                    if (badSeller == null)
                    {
                        return false;
                    }
                    db.SoldItems.Remove(badSeller);
                    db.SaveChanges();
                }
            }
            catch (Exception)
            {
                // FIXME log error
                return false;
            }

            return true;
        }

        // Business Expenses
        public bool AddExpense(BusinessExpenses expense)
        {
            if (expense != null)
            {
                db.BusinessExpenses.Add(expense);
                db.SaveChanges();
                return true;
            }
            return false;
        }

        // Resolution center
        // Returns
        public Returns AddReturns(Returns ret)
        {
            if (ret != null)
            {
                db.Returns.Add(ret);
                db.SaveChanges();
                return ret;
            }
            return null;
        }
        public List<Returns> GetAllReturns()
        {
            if (db.Returns == null)
            {
                return null;
            }

            return db.Returns.ToList();
        }

        public bool DeleteReturn(IdList returnIdList)
        {
            if (!HelperMethods.NullCheckForIdListIds(returnIdList))
            {
                return false;
            }

            try
            {
                int[] returnIds = returnIdList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int id in returnIds)
                {
                    var ret = db.Returns.Where(x => x.idreturns == id).FirstOrDefault();
                    if (ret == null)
                    {
                        return false;
                    }
                    db.Returns.Remove(ret);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }
            return true;
        }

        private void updateDbReturnsHelper(ref Returns dbReturns, Returns updReturns)
        {
            dbReturns.returnName = updReturns.returnName;
            //dbReturns.quantity = updReturns.quantity;
            //dbReturns.totalPrice = updReturns.totalPrice;
            //dbReturns.paymentMethod = updReturns.paymentMethod;
            //dbReturns.returnVendor = updReturns.returnVendor;
            dbReturns.returnDate = updReturns.returnDate;
            dbReturns.estimatedRefundTime = updReturns.estimatedRefundTime;
            dbReturns.deliveryDate = updReturns.deliveryDate;
            //dbReturns.trackingNum = updReturns.trackingNum;
        }
        public bool UpdateReturn(List<Returns> updatedReturns)
        {
            Returns dbReturns = null;
            try
            {
                foreach (Returns updRet in updatedReturns)
                {
                    dbReturns = db.Returns.Where(x => x.idreturns == updRet.idreturns).FirstOrDefault();
                    if (dbReturns == null)
                    {
                        // Error message popup if the update failed
                        return false;
                    }
                    updateDbReturnsHelper(ref dbReturns, updRet);
                    db.Returns.Update(dbReturns);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }

            return true;
        }
        // Insurance Claims
        public InsuranceClaims AddInsuranceClaim(InsuranceClaims claim)
        {
            if (claim != null)
            {
                db.InsuranceClaims.Add(claim);
                db.SaveChanges();
                return claim;
            }
            return null;
        }
        public List<InsuranceClaims> GetAllInsuranceClaims()
        {
            if (db.InsuranceClaims == null)
            {
                return null;
            }

            // FIXME moved to a new table
            //return db.InsuranceClaims.ToList();
            return null;
        }

        public bool DeleteInsuranceClaim(IdList insuranceClaimIds)
        {
            if (!HelperMethods.NullCheckForIdListIds(insuranceClaimIds))
            {
                return false;
            }

            try
            {
                int[] claimIds = insuranceClaimIds.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int id in claimIds)
                {
                    var claim = db.InsuranceClaims.Where(x => x.idinsuranceclaims == id).FirstOrDefault();
                    if (claim == null)
                    {
                        return false;
                    }
                    db.InsuranceClaims.Remove(claim);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }
            return true;
        }
        private void updateDbInsuranceClaimHelper(ref InsuranceClaims dbInsuranceClaims, InsuranceClaims updatedClaim)
        {
            dbInsuranceClaims.itemName = updatedClaim.itemName;
            dbInsuranceClaims.insuredFor = updatedClaim.insuredFor;
            dbInsuranceClaims.claimStatus = updatedClaim.claimStatus;
            dbInsuranceClaims.customerPreference = updatedClaim.customerPreference;
            dbInsuranceClaims.customerResolutionStatus = updatedClaim.customerResolutionStatus;
            dbInsuranceClaims.notes = updatedClaim.notes;
            dbInsuranceClaims.replacementTrackingNum = updatedClaim.replacementTrackingNum;
        }

        public bool UpdateInsuranceClaim(List<InsuranceClaims> updatedClaims)
        {
            InsuranceClaims dbInsuranceClaims = null;
            try
            {
                foreach (InsuranceClaims claim in updatedClaims)
                {
                    dbInsuranceClaims = db.InsuranceClaims.Where(x => x.idinsuranceclaims == claim.idinsuranceclaims).FirstOrDefault();
                    if (dbInsuranceClaims == null)
                    {
                        return false;
                    }
                    updateDbInsuranceClaimHelper(ref dbInsuranceClaims, claim);
                    db.InsuranceClaims.Update(dbInsuranceClaims);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }
            return true;
        }

        // Delayed shipping
        public ShippingDelayedPackages shippingDelayedPackage(ShippingDelayedPackages delayedPackage)
        {
            if (delayedPackage != null)
            {
                db.ShippingDelayedPackages.Add(delayedPackage);
                db.SaveChanges();
                return delayedPackage;
            }
            return null;
        }
        public List<ShippingDelayedPackages> GetShippingDelayedPackages()
        {
            if (db.ShippingDelayedPackages == null)
            {
                return null;
            }
            // FIXME moved to a new table
            //return db.ShippingDelayedPackages.ToList();
            return null;
        }
        public bool DeleteDelayedPackage(IdList delayedPackageIdList)
        {
            if (!HelperMethods.NullCheckForIdListIds(delayedPackageIdList))
            {
                return false;
            }

            try
            {
                int[] delayedPackageIds = delayedPackageIdList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int id in delayedPackageIds)
                {
                    var delayedPackage = db.ShippingDelayedPackages.Where(x => x.idshippingdelayedpackages == id).FirstOrDefault();
                    if (delayedPackage == null)
                    {
                        return false;
                    }
                    db.ShippingDelayedPackages.Remove(delayedPackage);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXMe log error
                return false;
            }
            return true;
        }
        private void updateDbDelayedPackageHelper(ref ShippingDelayedPackages dbDelayedPackage, ShippingDelayedPackages updatedPackage)
        {
            dbDelayedPackage.packageName = updatedPackage.packageName;
            dbDelayedPackage.lastScanDate = updatedPackage.lastScanDate;
            dbDelayedPackage.currentLoc = updatedPackage.currentLoc;
            dbDelayedPackage.serviceReqNum = updatedPackage.serviceReqNum;
            dbDelayedPackage.lastCustomerContactDate = updatedPackage.lastCustomerContactDate;
            dbDelayedPackage.note = updatedPackage.note;
        }
        public bool UpdateDelayedPackage(List<ShippingDelayedPackages> updatedPackages)
        {
            ShippingDelayedPackages dbDelayedPackages = null;
            try
            {
                foreach (ShippingDelayedPackages package in updatedPackages)
                {
                    dbDelayedPackages = db.ShippingDelayedPackages.Where(x => x.idshippingdelayedpackages == package.idshippingdelayedpackages).FirstOrDefault();
                    if (dbDelayedPackages == null)
                    {
                        return false;
                    }
                    updateDbDelayedPackageHelper(ref dbDelayedPackages, package);
                    db.ShippingDelayedPackages.Update(dbDelayedPackages);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }
            return true;
        }

        // Adorama Controller
        public AdoramaListings AddJamoListing(AdoramaListings adoramaListing)
        {
            if (adoramaListing != null)
            {
                db.AdoramaListings.Add(adoramaListing);
                db.SaveChanges();
                return adoramaListing;
            }
            return null;
        }

        public bool DeleteJamoListing(IdList jamoIds)
        {
            if (!HelperMethods.NullCheckForIdListIds(jamoIds))
            {
                return false;
            }

            try
            {
                int[] jamoListingIds = jamoIds.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int id in jamoListingIds)
                {
                    var jamoListing = db.AdoramaListings.Where(x => x.idadoramalistings == id).FirstOrDefault();
                    if (jamoListing == null)
                    {
                        return false;
                    }
                    db.AdoramaListings.Remove(jamoListing);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }

            return true;
        }

        public List<AdoramaListings> GetAllAdoramaListings()
        {
            if (db.AdoramaListings == null)
            {
                return null;
            }

            return db.AdoramaListings.ToList();
        }

        public AdoramaListings AddKlipschListing(AdoramaListings adoramaListing)
        {
            if (adoramaListing != null)
            {
                db.AdoramaListings.Add(adoramaListing);
                db.SaveChanges();
                return adoramaListing;
            }
            return null;
        }

        public bool DeleteKlipschListing(IdList klipschIds)
        {
            if (!HelperMethods.NullCheckForIdListIds(klipschIds))
            {
                return false;
            }

            try
            {
                int[] klipschListingIds = klipschIds.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int klipschId in klipschListingIds)
                {
                    AdoramaListings klipschListing = db.AdoramaListings.Where(x => x.idadoramalistings == klipschId).FirstOrDefault();
                    if (klipschListing == null)
                    {
                        return false;
                    }
                    db.Remove(klipschListing);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }
            return true;
        }

        public List<AdoramaListings> MakeAdoramaListingActive(IdList adoramaListingIds)
        {
            if (!HelperMethods.NullCheckForIdListIds(adoramaListingIds))
            {
                return null;
            }

            int[] adoramaIds = adoramaListingIds.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
            List<AdoramaListings> adoramaListings = new List<AdoramaListings>();
            try
            {
                foreach (int adoramaId in adoramaIds)
                {
                    AdoramaListings adoramaListing = db.AdoramaListings.Where(x => x.idadoramalistings == adoramaId).FirstOrDefault();
                    if (adoramaListing == null)
                    {
                        return null;
                    }
                    adoramaListing.active = 1;
                    db.AdoramaListings.Update(adoramaListing);
                    db.SaveChanges();
                    adoramaListings.Add(adoramaListing);
                }
                return adoramaListings;
            }
            catch(Exception ex)
            {
                // FIXME log error
                return null;
            }
        }

        public AdoramaListings AddMiscListing(AdoramaListings miscListing)
        {
            if (miscListing != null)
            {
                db.AdoramaListings.Add(miscListing);
                db.SaveChanges();
                return miscListing;
            }
            return null;
        }

        public bool DeleteMiscListing(IdList miscIds)
        {
            if (!HelperMethods.NullCheckForIdListIds(miscIds))
            {
                return false;
            }

            try
            {
                int[] miscListingIds = miscIds.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();

                foreach (int id in miscListingIds)
                {
                    var miscListing = db.AdoramaListings.Where(x => x.idadoramalistings == id).FirstOrDefault();
                    if (miscListing == null)
                    {
                        return false;
                    }
                    db.AdoramaListings.Remove(miscListing);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // FIXME log error
                return false;
            }
            return true;
        }
    }
}
