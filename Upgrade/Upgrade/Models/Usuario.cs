using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Upgrade.Models
{
    public class Usuario
    {
            [Key]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public long ID { get; set; }
            [Required]
            public string Mail { get; set; }
            public string Nombre { get; set; }

            public List<Producto> Productos{ get; set; }
        
    }
}

