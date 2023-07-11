using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContactsAPI.Models;
using System.Web.Http;
using ContactsAPI.Helpers;

namespace ContactsAPI.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ContactsAppDbContext _context;
        private readonly JwtService _jwtService;

        public ContactsController(ContactsAppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // Pobierz wszystkie kontakty
        // GET: api/Contacts
        [Microsoft.AspNetCore.Mvc.HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
          if (_context.Contacts == null)
          {
              return NotFound();
          }

          return await _context.Contacts.ToListAsync();
        }

        // Pobierz kontakt o określonym identyfikatorze
        // GET: api/Contacts/number
        [Microsoft.AspNetCore.Mvc.HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
          if (_context.Contacts == null)
          {
              return NotFound();
          }
            var contact = await _context.Contacts.FindAsync(id);

            if (contact == null)
            {
                return NotFound();
            }

            return contact;
        }

        // Aktualizuj kontakt o określonym identyfikatorze
        // PUT: api/Contacts/5
        [Microsoft.AspNetCore.Mvc.HttpPut("{id}")]
        public async Task<IActionResult> PutContact(int id, Contact contact)
        {
            contact.Id = id;
            _context.Entry(contact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Poprawnie zmodyfikowano rekord");
        }

        // Logowanie użytkownika - sprawdzenie danych logowania i generowanie tokena JWT
        // POST: api/Contacts
        [Microsoft.AspNetCore.Mvc.HttpPost("Login")]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            var temp = _context.Contacts
                .Where(x => x.Email == contact.Email)
                .FirstOrDefault();
            if (temp == null)
            {
                _context.Contacts.Add(contact);
                await _context.SaveChangesAsync();
            }
            else
            {
                contact = temp;
            }

            //var jwt = _jwtService.Generate(contact.Id);

            //Response.Cookies.Append("jwt", jwt, new CookieOptions
            //{
            //    HttpOnly = false
            //});

            return Ok(contact);
        }

        // Pobieranie informacji o zalogowanym użytkowniku na podstawie tokenu JWT
        [Microsoft.AspNetCore.Mvc.HttpPost("User")]
        public IActionResult User()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];

                var token = _jwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);

                var user = _context.Contacts
                .Where(x => x.Id == userId)
                .FirstOrDefault();

                return Ok(user);
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [Microsoft.AspNetCore.Mvc.HttpPost("Logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok();
        }

        // POST: api/Contacts/Add
        // Dodawanie nowego kontaktu
        [Microsoft.AspNetCore.Mvc.HttpPost("Add")]
        public async Task<ActionResult<Contact>> PostAddContact(Contact contact)
        {
            if (string.IsNullOrEmpty(contact.Name) ||
                string.IsNullOrEmpty(contact.Surname) ||
                string.IsNullOrEmpty(contact.Email) ||
                string.IsNullOrEmpty(contact.Password) ||
                !(string.IsNullOrEmpty(contact.PhoneNumber) ||
                System.Text.RegularExpressions.Regex.IsMatch(contact.PhoneNumber, @"^\d+$"))
                )
            {
                return BadRequest("Nie wszystkie pola sa poprawne");
            }

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return Ok("Pomyslnie dodano kontakt !");
        }

        // DELETE: api/Contacts/5
        // Usuń kontakt o określonym identyfikatorze
        [Microsoft.AspNetCore.Mvc.HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            if (_context.Contacts == null)
            {
                return NotFound();
            }
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Sprawdź, czy kontakt o określonym identyfikatorze istnieje
        private bool ContactExists(int id)
        {
            return (_context.Contacts?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
