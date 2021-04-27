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
        public List<CurrentInventory> GetAllCurrentInventory()
        {
            return db.Currentinventory.ToList();
        }

        public bool DeleteCurrentInventory(IdList idList)
        {
            try
            {
                int[] currentInventoryIds = idList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int id in currentInventoryIds)
                {
                    var item = db.Currentinventory.Where(x => x.idCurrentInventory == id).FirstOrDefault();
                    if (item == null)
                    {
                        return false;
                    }
                    db.Currentinventory.Remove(item);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {

            }
            return true;
        }

        public List<CurrentInventory> MoveIncomingInvToCurrentInv(IdList incomingInvIdList)
        {
            List<CurrentInventory> currInvList = new List<CurrentInventory>();
            try
            {
                int[] incomingInventoryIds = incomingInvIdList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
                foreach (int id in incomingInventoryIds)
                {
                    var item = db.IncomingInventory.Where(x => x.idIncomingInventory == id).FirstOrDefault();
                    if (item == null)
                    {
                        return null;
                    }
                    var curInv = HelperMethods.ConvertIncomingInvtoCurrInv(item);
                    db.Currentinventory.Add(curInv);
                    db.IncomingInventory.Remove(item);
                    db.SaveChanges();
                    currInvList.Add(curInv);
                }
            }
            catch (Exception ex)
            {

            }
            return currInvList;
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

        public bool DeleteIncomingInventory(IdList idList)
        {
            try
            {
                int[] incomingInventoryIds = idList.ids.Split(',').Select(n => Convert.ToInt32(n)).ToArray();
               foreach(int id in incomingInventoryIds)
                {
                    var item = db.IncomingInventory.Where(x => x.idIncomingInventory == id).FirstOrDefault();
                    if (item == null)
                    {
                        return false;
                    }
                    db.IncomingInventory.Remove(item);
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
        public bool AddReturns(Returns ret)
        {
            db.Returns.Add(ret);
            db.SaveChanges();
            return true;
        }
        public List<Returns> GetAllReturns()
        {
            return db.Returns.ToList();
        }

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
    }
}
