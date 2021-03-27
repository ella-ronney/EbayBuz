using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SampleProject.Model
{
    public class CurrentInventory : Item
    {
        [Key]
        public int idCurrentInventory { get; set; }
    }
}
