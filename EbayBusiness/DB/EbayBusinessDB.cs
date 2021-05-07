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
            return HelperMethods.GetCurrentorIncomingInventory(db.Inventory.ToList(),1);
        }

        public bool DeleteCurrentInventory(IdList idList)
        {
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

            }
            return true;
        }

        public List<Inventory> MoveIncomingInvToCurrentInv(IdList incomingInvIdList)
        {
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

            }
            return currInvList;
        }

        // Incoming Inventory Requests
        public List<Inventory> GetAllIncomingInventory()
        {
            return HelperMethods.GetCurrentorIncomingInventory(db.Inventory.ToList(), 0);
        }

        public bool AddIncomingInventory(Inventory inv)
        {
            db.Inventory.Add(inv);
            db.SaveChanges();
            return true;
        }

        public bool DeleteIncomingInventory(IdList idList)
        {
            try
            {
                int[] incomingInventoryIds = idList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
               foreach(int id in incomingInventoryIds)
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
            catch(Exception ex)
            {

            }
            return true;
        }

        // Top sellers
        public List<TopSellers> GetAllTopSellers()
        {
            return db.TopSellers.ToList();
        }

        // Business Expenses
        public bool AddExpense(BusinessExpenses expense)
        {
            db.BusinessExpenses.Add(expense);
            db.SaveChanges();
            return true;
        }

        // Resolution center
        // Returns
        public Returns AddReturns(Returns ret)
        {
            db.Returns.Add(ret);
            db.SaveChanges();
            return ret;
        }
        public List<Returns> GetAllReturns()
        {
            return db.Returns.ToList();
        }

        public bool DeleteReturn(IdList returnIdList)
        {
            try
            {
                int[] returnIds = returnIdList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach(int id in returnIds)
                {
                    var ret = db.Returns.Where(x => x.idreturns == id).FirstOrDefault();
                    if(ret == null)
                    {
                        return false;
                    }
                    db.Returns.Remove(ret);
                    db.SaveChanges();
                }
            }
            catch(Exception ex)
            {

            }
            return true;
        }
        // Insurance Claims
        public InsuranceClaims AddInsuranceClaim(InsuranceClaims claim)
        {
            db.InsuranceClaims.Add(claim);
            db.SaveChanges();
            return claim;
        }
        public List<InsuranceClaims> GetAllInsuranceClaims()
        {
            return db.InsuranceClaims.ToList();
        }

        public bool DeleteInsuranceClaim(IdList insuranceClaimIds)
        {
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

            }
            return true;
        }
        // Delayed shipping
        public ShippingDelayedPackages shippingDelayedPackage(ShippingDelayedPackages delayedPackage)
        {
            db.ShippingDelayedPackages.Add(delayedPackage);
            db.SaveChanges();
            return delayedPackage;
        }
        public List<ShippingDelayedPackages> GetShippingDelayedPackages()
        {
            return db.ShippingDelayedPackages.ToList();
        }
        public bool DeleteDelayedPackage (IdList delayedPackageIdList)
        {
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

            }
            return true;
        }
    }
}
