#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/contract.hpp>

class hello : public eosio::contract {

  public:
       hello( account_name self ):contract(self),_usernames(_self, _self){}
        /// @abi action
       void writemessage(account_name username, std::string msg );
       void rmmessage(account_name username);
;
  private:
    /// @abi table usernames i64
    struct username_info
    {
      account_name owner;
      std::string message;
      uint64_t primary_key()const { return owner; }
      EOSLIB_SERIALIZE( username_info, (owner)(message) )
    };
    typedef eosio::multi_index<N(usernames), username_info> usernames_table;
    usernames_table _usernames;
};

void hello::writemessage(account_name username, std::string msg ) {
  require_auth(username);
  auto user = _usernames.find( username );
  eosio_assert( user == _usernames.end(), "username already exists" );
    _usernames.emplace( username, [&]( auto& s ) {
      s.owner = username;
      s.message = msg;
    });
  eosio::print( "Welcome ", eosio::name{username}, " to quoxoft.com");
}

void hello::rmmessage(account_name username) {

    const auto& user = _usernames.get(username, "E404|Invalid username, destroying action is unrecoverable");

    require_auth(username);

    _usernames.erase( user );

}

EOSIO_ABI( hello, (writemessage)(rmmessage) )
