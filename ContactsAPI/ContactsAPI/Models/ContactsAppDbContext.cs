using Microsoft.EntityFrameworkCore;

namespace ContactsAPI.Models
{
    /// <summary>
    /// Reprezentacja kontekstu bazy danych w aplikacji
    /// Zawiera definicje table oraz umożliwia wykonywanie operacji na danych za pomocą DbSet
    /// </summary>
    public class ContactsAppDbContext:DbContext
    {
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public ContactsAppDbContext(DbContextOptions<ContactsAppDbContext> options)
            : base(options) { }
    }
}
