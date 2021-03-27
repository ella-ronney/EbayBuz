using SampleProject.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace SampleProject.Helper
{
    public class DBObjectCreater
    {
        public CurrentInventory CreateCurInvObj(string name, int qty, float price, string vendor, DateTime purchaseDate, string warranty, string serialnum)
        {
            return new CurrentInventory()
            {
                name = name,
                qty = qty,
                price = price,
                vendor = vendor, 
                purchaseDate = purchaseDate,
                warranty = warranty, 
                serialNumbers = serialnum
            };
        }
    }
}
