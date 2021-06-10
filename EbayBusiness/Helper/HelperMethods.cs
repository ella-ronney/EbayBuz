using EbayBusiness.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace EbayBusiness.Helper
{
    public static class HelperMethods
    {

        public static List<Inventory> GetCurrentorIncomingInventory(List<Inventory> dbInventoryList, int currentInventoryFlag)
        {
            List<Inventory> targetedInventoryList = new List<Inventory>();
            foreach (Inventory item in dbInventoryList)
            {
                if (item.currentInventory == currentInventoryFlag)
                {
                    targetedInventoryList.Add(item);
                }
            }
            return targetedInventoryList;
        }

        public static string RemoveLastChar(string val)
        {
            return val.Substring(0, val.Length - 1);
        }

        public static bool NullCheckForIdListIds(IdList idList)
        {
            if (idList == null || String.IsNullOrEmpty(idList.ids))
            {
                return false;
            }
            return true;
        }

    }
}
