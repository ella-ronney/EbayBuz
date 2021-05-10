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

    }
}
