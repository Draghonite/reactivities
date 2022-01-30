using System;
using Xunit;

namespace API.Tests
{
    public class ExampleTests
    {
        [Fact]
        public void TestSuccess1()
        {

        }


        [Fact]
        public void TestSuccess2()
        {

        }

        [Theory]
        [InlineData("https://www.google.com")]
        [InlineData("fffaaa")]
        public void TestMalformedUri(string uri)
        {
            new Uri(uri);
        }
    }
}