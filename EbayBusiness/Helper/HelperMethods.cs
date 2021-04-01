using SampleProject.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace EbayBusiness.Helper
{
    public static class HelperMethods
    {
        public static CurrentInventory ConvertIncomingInvtoCurrInv(IncomingInventory inv)
        {
            return new CurrentInventory
            {
                name = inv.name,
                qty = inv.qty,
                price = inv.price,
                vendor = inv.vendor,
                purchaseDate = inv.purchaseDate,
                warranty = inv.warranty,
                serialNumbers = inv.serialNumbers
            };
        }

    }
}
