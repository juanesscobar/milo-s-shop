import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, QrCode } from "lucide-react";
export default function PaymentSelector(_a) {
    var selectedMethod = _a.selectedMethod, amount = _a.amount, onSelect = _a.onSelect, onConfirmPayment = _a.onConfirmPayment, _b = _a.language, language = _b === void 0 ? 'es' : _b;
    var content = {
        es: {
            title: "Método de pago",
            subtitle: "Selecciona cómo deseas pagar tu servicio",
            total: "Total a pagar",
            confirm: "Confirmar pago",
            selectMethod: "Selecciona un método de pago"
        },
        pt: {
            title: "Método de pagamento",
            subtitle: "Selecione como deseja pagar seu serviço",
            total: "Total a pagar",
            confirm: "Confirmar pagamento",
            selectMethod: "Selecione um método de pagamento"
        }
    };
    var t = content[language];
    var paymentMethods = [
        {
            id: 'card',
            name: language === 'es' ? 'Tarjeta de crédito/débito' : 'Cartão de crédito/débito',
            description: language === 'es' ? 'Pago instantáneo con tarjeta' : 'Pagamento instantâneo com cartão',
            icon: CreditCard,
            available: true
        },
        {
            id: 'pix',
            name: 'PIX',
            description: language === 'es' ? 'Transferencia inmediata' : 'Transferência imediata',
            icon: QrCode,
            badge: language === 'es' ? 'Popular' : 'Popular',
            available: true
        },
        {
            id: 'cash',
            name: language === 'es' ? 'Efectivo' : 'Dinheiro',
            description: language === 'es' ? 'Pagar en el local' : 'Pagar no local',
            icon: Banknote,
            available: true
        }
    ];
    var formatPrice = function (price) {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG',
            minimumFractionDigits: 0,
        }).format(price);
    };
    return (<div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Total Amount */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="text-center py-6">
          <div className="text-sm text-muted-foreground mb-2">{t.total}</div>
          <div className="text-3xl font-bold text-primary">
            {formatPrice(amount)}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-3">
        {paymentMethods.map(function (method) {
            var IconComponent = method.icon;
            var isSelected = selectedMethod === method.id;
            return (<Card key={method.id} className={"cursor-pointer transition-all hover-elevate ".concat(isSelected
                    ? 'ring-2 ring-primary border-primary bg-primary/5'
                    : 'border-border', " ").concat(!method.available ? 'opacity-50 cursor-not-allowed' : '')} onClick={function () { return method.available && onSelect(method.id); }} data-testid={"card-payment-".concat(method.id)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={"h-6 w-6 ".concat(isSelected ? 'text-primary' : 'text-muted-foreground')}/>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={"font-medium ".concat(isSelected ? 'text-primary' : 'text-foreground')}>
                          {method.name}
                        </h4>
                        {method.badge && (<Badge variant="secondary" className="text-xs">
                            {method.badge}
                          </Badge>)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  
                  {isSelected && (<div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"/>
                    </div>)}
                </div>
              </CardContent>
            </Card>);
        })}
      </div>

      {/* Confirm Button */}
      <Button onClick={onConfirmPayment} disabled={!selectedMethod} className="w-full py-6 text-lg" data-testid="button-confirm-payment">
        {selectedMethod ? t.confirm : t.selectMethod}
      </Button>

      {/* PIX QR Code (Mock) */}
      {selectedMethod === 'pix' && (<Card className="border-dashed">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5"/>
              Código PIX
            </CardTitle>
            <CardDescription>
              {language === 'es'
                ? 'Escanea el código QR para realizar el pago'
                : 'Escaneie o código QR para realizar o pagamento'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="w-32 h-32 bg-muted rounded-lg mx-auto flex items-center justify-center">
              <QrCode className="h-16 w-16 text-muted-foreground"/>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {language === 'es'
                ? 'En la aplicación real se mostraría el código QR real'
                : 'No aplicativo real seria mostrado o código QR real'}
            </p>
          </CardContent>
        </Card>)}
    </div>);
}
