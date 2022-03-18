using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projektic.Migrations
{
    public partial class V2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FirmaID",
                table: "Radnik",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Firma",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Firma", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Radnik_FirmaID",
                table: "Radnik",
                column: "FirmaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Radnik_Firma_FirmaID",
                table: "Radnik",
                column: "FirmaID",
                principalTable: "Firma",
                principalColumn: "ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Radnik_Firma_FirmaID",
                table: "Radnik");

            migrationBuilder.DropTable(
                name: "Firma");

            migrationBuilder.DropIndex(
                name: "IX_Radnik_FirmaID",
                table: "Radnik");

            migrationBuilder.DropColumn(
                name: "FirmaID",
                table: "Radnik");
        }
    }
}
