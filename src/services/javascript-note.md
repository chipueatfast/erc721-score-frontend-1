```javascript
    async () => {
        try {
            // this can catch the error happen when the promise is being execute
            await getContract().methods.mint(toAddress, scoreHash).send({
                from: fromAddress,
            });
            getContract().once('Transfer', (err, data) => {
                resolve({
                    reponse: {
                        tokenId: data.returnValues.tokenId,
                    },
                })
            })

        } catch (error) {
            return resolve({
                errorMessage: error.message,
            });
        }
    }
```

```javascript
    () => {
        try {
            // this can not
            getContract().methods.mint(toAddress, scoreHash).send({
                from: fromAddress,
            });
            getContract().once('Transfer', (err, data) => {
                resolve({
                    reponse: {
                        tokenId: data.returnValues.tokenId,
                    },
                })
            })

        } catch (error) {
            return resolve({
                errorMessage: error.message,
            });
        }
    }
```